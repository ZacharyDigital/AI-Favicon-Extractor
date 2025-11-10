import { create, insertMultiple, search as oramaSearch } from '@orama/orama';
import type { AnyOrama } from '@orama/orama';

export interface SearchDocument {
  id: string;
  title: string;
  content: string;
  url: string;
  type: 'doc' | 'blog';
}

let searchDB: AnyOrama | null = null;

export async function initializeSearch(documents: SearchDocument[]) {
  if (searchDB) return searchDB;

  searchDB = await create({
    schema: {
      id: 'string',
      title: 'string',
      content: 'string',
      url: 'string',
      type: 'string',
    },
  });

  if (searchDB) {
    await insertMultiple(searchDB, documents);
  }
  return searchDB;
}

export async function searchDocuments(query: string, limit = 10) {
  if (!searchDB) {
    throw new Error('Search database not initialized');
  }

  const results = await oramaSearch(searchDB, {
    term: query,
    properties: ['title', 'content'],
    limit,
  });

  return results.hits.map((hit) => hit.document);
}
