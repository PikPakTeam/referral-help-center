import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';

export interface TocHeading {
  level: number;
  id: string;
  title: string;
}

export function createHeadingId(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
}

export const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  highlight(code, language) {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language }).value;
    }

    return hljs.highlightAuto(code).value;
  },
});

markdown.use(anchor, {
  level: [2, 3],
  slugify: createHeadingId,
});

export function extractToc(markdownSource: string): TocHeading[] {
  return markdownSource
    .split('\n')
    .map((line) => line.match(/^(#{2,3})\s+(.+)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => ({
      level: match[1].length,
      title: match[2].trim(),
      id: createHeadingId(match[2]),
    }));
}
