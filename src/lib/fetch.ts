import { ProxyHttpBridge } from '@/bridges'
import { createGraphiQLFetcher } from '@graphiql/toolkit'

export function timeoutFetch(params: {
  url: string
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

    ProxyHttpBridge.proxy_http_request({
      url,
      method: options?.method || 'GET',
      headers: options?.headers as Record<string, string>,
      body: typeof options?.body === 'string' ? options.body : undefined,
    })
      .then((res) => {
        clearListeners()
        const response = new Response(res.body, {
          status: res.status_code,
          statusText: '',
          headers: new Headers(res.headers),
        })
        resolve(response)
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
    fetch: (_, options) =>
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
