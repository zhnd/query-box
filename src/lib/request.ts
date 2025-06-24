import { Endpoint } from '@/generated/typeshare-types'

export function formatHeadersStringToObject(
  headers: string | undefined | null
): Record<string, string> | undefined {
  if (!headers) return
  try {
    const arr = JSON.parse(headers) as Array<{
      id: string
      key: string
      value: string
    }>
    if (!Array.isArray(arr)) return
    return arr.reduce(
      (acc, item) => {
        if (item.key) {
          acc[item.key] = item.value
        }
        return acc
      },
      {} as Record<string, string>
    )
  } catch (e) {
    console.error('Failed to parse headers string:', e)
  }
}

export function getGraphQLRequestHeaders(params: {
  endpoint: Pick<Endpoint, 'url' | 'headers' | 'auth'> | undefined | null
  customHeaders?: Record<string, string>
}): Record<string, string> | undefined {
  const { endpoint, customHeaders } = params

  if (!endpoint) return

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'User-Agent': navigator.userAgent,
    ...formatHeadersStringToObject(endpoint.headers),
  }

  if (endpoint.auth) {
    defaultHeaders['Authorization'] = `Basic ${btoa(
      `${endpoint.auth?.username || ''}:${endpoint.auth?.password || ''}`
    )}`
  }

  return { ...defaultHeaders, ...customHeaders }
}
