/* eslint-disable @typescript-eslint/no-unused-expressions */
import { toast } from 'sonner';

type FetcherReturnType = 'json' | 'text' | 'blob' | 'raw';

export const fetcher = async <T>(
  url: string,
  options: RequestInit = {},
  config: {
    returnType?: FetcherReturnType;
    timeout?: number;
    token?: string;
  } = {},
): Promise<T> => {
  const { returnType = 'json', timeout = 10000, token } = config;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const body = options.body
    ? options.body instanceof FormData
      ? options.body
      : JSON.stringify(options.body)
    : undefined;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseClone = res.clone();

    if (res.status === 201) {
      try {
        const data = await responseClone.json();
        data?.message && toast.success(data.message);
      } catch (e) {
        toast.success(e as string || 'Operation completed successfully');
      }
    } else if (res.status >= 400 && res.status < 500) {
      const data = await responseClone.json()
      try {
        data?.message && toast.error(data.message || 'Please check your request.')
      } catch (e) {
        toast.error(data?.message || e as string || 'Please check your request.');
      }
    } else if (res.status >= 500 && res.status < 600) {
      console.error('Server Error. Please try again later.');
    }

    if (!res.ok) {
      console.log(res?.text() || 'error occuring due to fetch');
    }

    return (await {
      json: () => responseClone.json(),
      text: () => res.text(),
      blob: () => res.blob(),
      raw: () => res,
    }[returnType]()) as T;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};
