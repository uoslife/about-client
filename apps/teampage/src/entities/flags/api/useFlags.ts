'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Etags, FlagVersionsResponse, FlagsBundle, FlagsResponse } from '../model';

export const FLAGS_QUERY_KEY = ['ab-test', 'flags'] as const;
export const FLAG_VERSIONS_QUERY_KEY = ['ab-test', 'flag-versions'] as const;

export class FlagsApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const request = async <T>(input: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new FlagsApiError(response.status, body?.message || '요청에 실패했습니다.');
  }

  return (await response.json()) as T;
};

export const useFlags = () =>
  useQuery({
    queryKey: FLAGS_QUERY_KEY,
    queryFn: () => request<FlagsResponse>('/api/flags'),
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: false,
  });

export interface SaveFlagsVariables {
  mode: 'draft' | 'publish';
  etags: Etags;
  bundle: FlagsBundle;
}

export const useSaveFlags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: SaveFlagsVariables) =>
      request<FlagsResponse>('/api/flags', { method: 'PUT', body: JSON.stringify(variables) }),
    onSuccess: (data) => {
      queryClient.setQueryData<FlagsResponse>(FLAGS_QUERY_KEY, data);
      queryClient.invalidateQueries({ queryKey: FLAG_VERSIONS_QUERY_KEY });
    },
  });
};

export const useFlagVersions = (enabled: boolean) =>
  useQuery({
    queryKey: FLAG_VERSIONS_QUERY_KEY,
    queryFn: () => request<FlagVersionsResponse>('/api/flags/versions'),
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
  });

export const useRollbackFlags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { scope: 'public' | 'private'; versionId: string }) =>
      request<{ scope: string; versionId: string }>('/api/flags/rollback', {
        method: 'POST',
        body: JSON.stringify(variables),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FLAGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: FLAG_VERSIONS_QUERY_KEY });
    },
  });
};
