import MiniSearch from 'minisearch';

import { getDocs, type DocRecord, type Locale } from './docs';

interface SearchDocument {
  id: string;
  title: string;
  content: string;
  section: string;
}

export interface SearchResult {
  id: string;
  title: string;
  href: string;
  section: string | null;
  excerpt: string;
}

const indexes = new Map<Locale, MiniSearch<SearchDocument>>();

for (const locale of ['zh-CN', 'en-US'] as const) {
  const docs = getDocs(locale);
  const search = new MiniSearch<SearchDocument>({
    fields: ['title', 'content', 'section'],
    storeFields: ['id', 'title', 'section'],
    searchOptions: {
      prefix: true,
      fuzzy: 0.1,
    },
  });

  search.addAll(
    docs.map((doc) => ({
      id: doc.id,
      title: doc.title,
      content: doc.plainText,
      section: doc.section ?? '',
    })),
  );

  indexes.set(locale, search);
}

function createFallbackResults(query: string, docs: DocRecord[], existingIds: Set<string>): SearchResult[] {
  const normalized = query.trim().toLowerCase();

  return docs
    .filter((doc) => !existingIds.has(doc.id))
    .filter((doc) => `${doc.title} ${doc.plainText}`.toLowerCase().includes(normalized))
    .slice(0, 8)
    .map((doc) => ({
      id: doc.id,
      title: doc.title,
      href: doc.routePath,
      section: doc.section,
      excerpt: doc.excerpt,
    }));
}

export function searchDocs(locale: Locale, query: string): SearchResult[] {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  const docs = getDocs(locale);
  const search = indexes.get(locale);
  if (!search) {
    return [];
  }

  const primaryResults = search.search(trimmedQuery, {
    prefix: true,
    fuzzy: trimmedQuery.length > 4 ? 0.2 : 0,
  });

  const results = primaryResults
    .map((result) => docs.find((doc) => doc.id === result.id))
    .filter((doc): doc is DocRecord => Boolean(doc))
    .map((doc) => ({
      id: doc.id,
      title: doc.title,
      href: doc.routePath,
      section: doc.section,
      excerpt: doc.excerpt,
    }));

  const ids = new Set(results.map((result) => result.id));

  return [...results, ...createFallbackResults(trimmedQuery, docs, ids)].slice(0, 12);
}
