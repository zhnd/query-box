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
