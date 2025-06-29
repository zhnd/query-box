import { markdown } from '@/lib'
import { useMemo } from 'react'

export interface MarkdownRenderProps {
  content: string | undefined | null
}

export const useMarkdownRenderService = (data: MarkdownRenderProps) => {
  const { content } = data
  const markdownContent = useMemo(() => {
    if (!content) return ''
    return markdown.render(content || '')
  }, [content])

  return {
    markdownContent,
  }
}
