import { createGraphiQLFetcher } from '@graphiql/toolkit'

export function timeoutFetch(params: {
  url: Parameters<typeof fetch>[0]
  options?: RequestInit
  timeout?: number
  signal?: AbortSignal
}): Promise<Response> {
  const { url, options, timeout = 10000, signal } = params
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Request timed out after ${timeout}ms`))
    }, timeout)

    const onAbort = () => {
      clearTimeout(timeoutId)
      reject(new Error('Request aborted'))
    }

    const clearListeners = () => {
      clearTimeout(timeoutId)
      signal?.removeEventListener('abort', onAbort)
    }

    signal?.addEventListener('abort', onAbort)

    fetch(url, options)
      .then((res) => {
        clearListeners()
        resolve(res)
      })
      .catch((err) => {
        clearListeners()
        signal?.removeEventListener('abort', onAbort)
        reject(err)
      })
  })
}

export function createGraphQLFetcher(params: {
  url: string
  headers?: Record<string, string>
  timeout?: number // Request timeout in milliseconds
  signal?: AbortSignal
}) {
  const { url, headers, timeout, signal } = params
  return createGraphiQLFetcher({
    url,
    fetch: (url, options) =>
      timeoutFetch({
        url,
        options: {
          ...options,
          headers: {
            ...options?.headers,
            ...headers,
          },
          signal,
        },
        timeout,
      }),
  })
}
