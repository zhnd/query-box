import { useMemo } from 'react'

export function ParsedDescription(props: { text: string }) {
  const { text } = props
  const parts = useMemo(() => text.split(/(`[^`]+`)/g), [text])

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const code = part.slice(1, -1)
      return (
        <code
          key={index}
          className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
        >
          {code}
        </code>
      )
    }
    return <span key={index}>{part}</span>
  })
}
