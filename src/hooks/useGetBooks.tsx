import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { LibriVoxResponse } from 'src/lib/api';
import { api } from 'src/lib/api-helper';

export function useGetInfiniteBooks({
  searchQuery,
  offset = 0,
  limit = 20,
  enabled = true,
}: {
  searchQuery: string;
  enabled: boolean;
  offset?: number;
  limit?: number;
}) {
  return useInfiniteQuery({
    queryKey: ['books', searchQuery, offset, limit],
    queryFn: async () => {
      const queryString = `/audiobooks/?offset=${offset}&coverart=1&limit=${limit}&format=json`;

      const { data, error } = await api.get<LibriVoxResponse>(
        searchQuery
          ? `title/^${encodeURIComponent(searchQuery)}${queryString}`
          : queryString
      );
      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return [];
      }

      return data.books;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return pages.length;
    },
    enabled,
  });
}
export function useGetBooks({
  query,
  offset = 0,
  limit = 20,
}: {
  query: string;
  offset?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['books', query, offset, limit],
    queryFn: async () => {
      const queryString = `/audiobooks/?offset=${offset}&coverart=1&limit=${limit}&format=json`;
      const { data, error } = await api.get<LibriVoxResponse>(
        query
          ? `title/^${encodeURIComponent(query)}${queryString}`
          : queryString
      );

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return [];
      }

      return data.books;
    },
  });
}

export function useGetBook({ id }: { id: string }) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const { data, error } = await api.get<LibriVoxResponse>(
        `/audiobooks/?id=${id}&coverart=1&format=json`
      );

      if (error) {
        throw new Error(error.message);
      }

      if (!data) {
        return null;
      }

      return data.books[0];
    },
    enabled: !!id,
  });
}
