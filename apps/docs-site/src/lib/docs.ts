import { extractToc, markdown, type TocHeading } from './markdown';

export const locales = ['zh-CN', 'en-US'] as const;

export type Locale = (typeof locales)[number];

export interface NavItem {
  title: string;
  href: string;
  children: NavItem[];
}

export interface DocRecord {
  id: string;
  locale: Locale;
  relativePath: string;
  routePath: string;
  title: string;
  section: string | null;
  raw: string;
  html: string;
  excerpt: string;
  plainText: string;
  headings: TocHeading[];
  isSectionHome: boolean;
  isLocaleHome: boolean;
}

const markdownModules = import.meta.glob('../../../../docs/{zh-CN,en-US}/**/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

const summaryModules = import.meta.glob('../../../../docs/{zh-CN,en-US}/SUMMARY.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>;

function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

function normalizeSegments(parts: string[]): string[] {
  const stack: string[] = [];

  for (const part of parts) {
    if (part === '' || part === '.') {
      continue;
    }

    if (part === '..') {
      stack.pop();
      continue;
    }

    stack.push(part);
  }

  return stack;
}

function toRoutePath(locale: Locale, relativePath: string): string {
  if (relativePath === 'README.md') {
    return `/${locale}`;
  }

  if (relativePath.endsWith('/README.md')) {
    return `/${locale}/${relativePath.slice(0, -'/README.md'.length)}`;
  }

  return `/${locale}/${relativePath.slice(0, -'.md'.length)}`;
}

function toPlainText(raw: string): string {
  return raw
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/[`>*_~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toExcerpt(raw: string): string {
  const paragraphs = raw
    .split('\n\n')
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk && !chunk.startsWith('#'));

  return toPlainText(paragraphs[0] ?? raw).slice(0, 180);
}

function resolveRelativeMarkdownPath(fromRelativePath: string, targetPath: string): string {
  const fromSegments = fromRelativePath.split('/');
  fromSegments.pop();

  return normalizeSegments([...fromSegments, ...targetPath.split('/')]).join('/');
}

function rewriteMarkdownLinks(raw: string, locale: Locale, relativePath: string): string {
  return raw.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label: string, href: string) => {
    if (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('#')
    ) {
      return match;
    }

    const [targetPath, hash = ''] = href.split('#');
    const resolvedPath = resolveRelativeMarkdownPath(relativePath, targetPath);
    const suffix = hash ? `#${hash}` : '';

    if (resolvedPath.endsWith('.md')) {
      return `[${label}](${toRoutePath(locale, resolvedPath)}${suffix})`;
    }

    return match;
  });
}

function createDocRecord(modulePath: string, raw: string): DocRecord {
  const pathMatch = modulePath.match(/docs\/(?<locale>zh-CN|en-US)\/(?<relativePath>.+)$/);

  if (!pathMatch?.groups) {
    throw new Error(`Unsupported markdown module path: ${modulePath}`);
  }

  const locale = pathMatch.groups.locale;
  if (!isLocale(locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  const relativePath = pathMatch.groups.relativePath;
  const titleMatch = raw.match(/^#\s+(.+)$/m);
  const title = titleMatch?.[1]?.trim() ?? relativePath.replace(/\.md$/, '');
  const routePath = toRoutePath(locale, relativePath);

  return {
    id: `${locale}:${relativePath}`,
    locale,
    relativePath,
    routePath,
    title,
    section: relativePath === 'README.md' ? null : relativePath.split('/')[0],
    raw,
    // Rewrite relative markdown links before rendering so the shared docs source
    // can stay GitBook-friendly while still producing app routes inside the site.
    html: markdown.render(rewriteMarkdownLinks(raw, locale, relativePath)),
    excerpt: toExcerpt(raw),
    plainText: toPlainText(raw),
    headings: extractToc(raw),
    isSectionHome: relativePath.endsWith('/README.md'),
    isLocaleHome: relativePath === 'README.md',
  };
}

function parseSummary(locale: Locale, raw: string): NavItem[] {
  const lineMatches = raw
    .split('\n')
    .map((line) => line.match(/^(\s*)-\s+\[([^\]]+)\]\(([^)]+)\)\s*$/))
    .filter((match): match is RegExpMatchArray => Boolean(match));

  const root: NavItem = {
    title: '',
    href: '',
    children: [],
  };

  const stack: NavItem[] = [root];

  for (const match of lineMatches) {
    const depth = match[1].length / 2;
    const title = match[2];
    const href = toRoutePath(locale, match[3]);
    const item: NavItem = {
      title,
      href,
      children: [],
    };

    // SUMMARY.md indentation is the only navigation source of truth. Building
    // the stack from indent depth keeps docs navigation and GitBook navigation aligned.
    stack.length = depth + 1;
    stack[depth]?.children.push(item);
    stack[depth + 1] = item;
  }

  return root.children[0]?.children ?? [];
}

const docs = Object.entries(markdownModules)
  .map(([modulePath, raw]) => createDocRecord(modulePath, raw))
  .sort((left, right) => left.routePath.localeCompare(right.routePath));

const docsById = new Map(docs.map((doc) => [doc.id, doc]));
const docsByLocale = new Map<Locale, DocRecord[]>(
  locales.map((locale) => [locale, docs.filter((doc) => doc.locale === locale)]),
);
const navByLocale = new Map<Locale, NavItem[]>(
  locales.map((locale) => {
    const summaryEntry = Object.entries(summaryModules).find(([path]) => path.includes(`/docs/${locale}/SUMMARY.md`));

    return [locale, parseSummary(locale, summaryEntry?.[1] ?? '')];
  }),
);

export function getLocales(): Locale[] {
  return [...locales];
}

export function getNav(locale: Locale): NavItem[] {
  return navByLocale.get(locale) ?? [];
}

export function getDocs(locale: Locale): DocRecord[] {
  return docsByLocale.get(locale) ?? [];
}

export function getDocByRelativePath(locale: Locale, relativePath: string): DocRecord | undefined {
  return docsById.get(`${locale}:${relativePath}`);
}

export function getDocByRoute(locale: Locale, routeRemainder: string[]): DocRecord | undefined {
  const normalizedRemainder = routeRemainder.filter(Boolean).join('/');
  const candidatePaths = normalizedRemainder
    ? [`${normalizedRemainder}.md`, `${normalizedRemainder}/README.md`]
    : ['README.md'];

  return candidatePaths
    .map((relativePath) => getDocByRelativePath(locale, relativePath))
    .find((doc): doc is DocRecord => Boolean(doc));
}

export function getRouteSuffix(routePath: string): string {
  return routePath.replace(/^\/(zh-CN|en-US)/, '') || '';
}

export function getLocaleRouteFromSegments(locale: Locale, routeRemainder: string[]): string {
  const suffix = routeRemainder.length ? `/${routeRemainder.join('/')}` : '';
  const fallback = `/${locale}`;
  const candidate = `/${locale}${suffix}`;

  return getDocByRoute(locale, routeRemainder) ? candidate : fallback;
}
