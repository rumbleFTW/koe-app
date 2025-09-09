'use client';

import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { fetcher } from '../utils/fetcher';

interface FetcherOptions<T> {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: Record<string, unknown> | FormData;
  pagination?: { page: number; limit: number };
  initialData?: T;
  revalidateOnFocus?: boolean;
  shouldRetryOnError?: boolean;
  isFormData?: boolean;
  customHeaders?: Record<string, string>;
  cache?: 'force-cache' | 'no-store';
  removeToken?: boolean;
  url?: string;
}

export const useSWRFetcher = <T>(
  endpoint: string | null,
  options: FetcherOptions<T> = {},
) => {
  const {
    method = 'GET',
    body,
    pagination,
    initialData,
    revalidateOnFocus = false,
    shouldRetryOnError = false,
    isFormData = false,
    customHeaders = {},
    cache = 'no-store',
    removeToken = false,
    url: customUrl,
  } = options;

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

  const { data: session, status } = useSession();
  const sessionLoading = status === 'loading';

  const headers: Record<string, string> = {
    ...customHeaders,
    'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    ...(removeToken || !session?.accessToken
      ? {}
      : { Authorization: `Bearer ${session.accessToken}` }),
  };

  const finalUrl = customUrl
    ? customUrl
    : `${baseUrl}${endpoint}${pagination ? `?page=${pagination.page}&limit=${pagination.limit}` : ''}`;

  const {
    data: response,
    error,
    isLoading,
    isValidating,
    mutate: swrMutate,
  } = useSWR<T>(
    !sessionLoading && method === 'GET' && finalUrl
      ? [finalUrl, session?.accessToken]
      : null,
    ([url]) =>
      fetcher<T>(
        url,
        {
          method,
          headers,
          cache,
        },
        {
          token: session?.accessToken,
        },
      ),
    {
      fallbackData: initialData,
      revalidateOnFocus,
      shouldRetryOnError,
    },
  );

  const executeMutation = async ({
    url: u = endpoint || '',
    method: m = method,
    body: b = body,
    isFormData: isF = false,
    customHeaders: h = headers,
  }: FetcherOptions<T>) => {
    if (sessionLoading) return;
    try {
      const options: RequestInit = {
        method: m,
        headers: h,
        body: b ? (isF ? (b as FormData) : (b as BodyInit)) : undefined,
      };
      const result = await fetcher<T>(`${baseUrl}${u}`, options);

      if (m === 'DELETE') {
        swrMutate(undefined, false);
      } else {
        swrMutate({ ...response, ...result }, false);
      }

      return result;
    } catch (err) {
      throw err;
    }
  };

  console.log(response, 'rrrrrrrrrrrrrrr');

  return {
    response,
    data:
      response && typeof response === 'object' && 'data' in response
        ? (response as { data: T })?.data
        : undefined,
    error,
    loading: isLoading,
    isValidating,
    mutate: swrMutate,
    executeMutation,
  };
};
