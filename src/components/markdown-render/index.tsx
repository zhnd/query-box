import { cn } from '@/lib/utils'
import { MarkdownRenderProps, useMarkdownRenderService } from './use-service'

export function MarkdownRender(props: MarkdownRenderProps) {
  const server = useMarkdownRenderService(props)

  return (
    <div
      className={cn(
        // base prose configuration
        'prose prose-neutral max-w-none',
        'dark:prose-invert',

        // improved typography scale
        'prose-sm leading-normal',

        // heading improvements
        'prose-headings:scroll-m-20 prose-headings:font-semibold prose-headings:tracking-tight',
        'prose-headings:text-foreground',
        'prose-h1:text-2xl prose-h1:lg:text-3xl prose-h1:mb-4 prose-h1:mt-0',
        'prose-h1:border-b prose-h1:border-border prose-h1:pb-2',
        'prose-h2:text-xl prose-h2:lg:text-2xl prose-h2:mt-8 prose-h2:mb-3',
        'prose-h2:border-b prose-h2:border-border prose-h2:pb-2',
        'prose-h3:text-lg prose-h3:lg:text-xl prose-h3:mt-6 prose-h3:mb-2',
        'prose-h4:text-base prose-h4:mt-4 prose-h4:mb-2 prose-h4:font-medium',
        'prose-h5:text-sm prose-h5:mt-3 prose-h5:mb-1 prose-h5:font-medium',
        'prose-h6:text-sm prose-h6:mt-3 prose-h6:mb-1 prose-h6:font-medium prose-h6:text-muted-foreground',

        // paragraph and text improvements
        'prose-p:leading-6 prose-p:text-foreground prose-p:mb-3',
        'prose-p:[&:not(:first-child)]:mt-0',
        'prose-lead:text-xl prose-lead:text-muted-foreground prose-lead:leading-8',
        'prose-strong:font-semibold prose-strong:text-foreground',
        'prose-em:italic prose-em:text-foreground/90',

        // enhanced list styles
        'prose-ul:my-3 prose-ul:space-y-1',
        'prose-ol:my-3 prose-ol:space-y-1',
        'prose-li:text-foreground prose-li:leading-6',
        'prose-li:marker:text-muted-foreground',
        'prose-ul > li:before:bg-muted-foreground',

        // improved blockquote design
        'prose-blockquote:my-4 prose-blockquote:border-l-4 prose-blockquote:border-primary/20',
        'prose-blockquote:bg-muted/30 prose-blockquote:pl-4 prose-blockquote:pr-3 prose-blockquote:py-3',
        'prose-blockquote:italic prose-blockquote:text-muted-foreground',
        'prose-blockquote:rounded-r-lg prose-blockquote:not-italic',
        'prose-blockquote:font-medium prose-blockquote:text-foreground/80',

        // enhanced inline code (not in pre)
        'prose-code:relative prose-code:rounded-md prose-code:bg-muted',
        'prose-code:border prose-code:border-border',
        'prose-code:px-1 prose-code:text-sm',
        'prose-code:font-mono prose-code:text-foreground',

        // reset code styles when inside pre (code blocks)
        'prose-pre:prose-code:bg-transparent prose-pre:prose-code:border-0',

        // improved code block styling
        'prose-pre:my-4 prose-pre:overflow-x-auto prose-pre:rounded-lg',
        'prose-pre:border prose-pre:border-border prose-pre:bg-muted/50',
        'prose-pre:p-3 prose-pre:text-sm prose-pre:leading-5',
        'prose-pre:shadow-sm',

        // clear inline code styles in pre
        // tailwindcss typography plugin applies these styles to code inside pre
        "prose-code:before:content-[''] prose-code:after:content-['']",

        // enhanced table design
        'prose-table:my-4 prose-table:w-full prose-table:border-collapse',
        'prose-table:overflow-hidden prose-table:rounded-lg prose-table:border',
        'prose-table:border-border prose-table:shadow-sm',
        'prose-thead:bg-muted/50',
        'prose-tr:border-b prose-tr:border-border prose-tr:last:border-b-0',
        'prose-tr:even:bg-muted/20',
        'prose-th:border-r prose-th:border-border prose-th:px-3 prose-th:py-2',
        'prose-th:text-left prose-th:font-semibold prose-th:text-foreground',
        'prose-th:last:border-r-0',
        'prose-td:border-r prose-td:border-border prose-td:px-3 prose-td:py-2',
        'prose-td:text-foreground prose-td:last:border-r-0',

        // improved link styling
        'prose-a:font-medium prose-a:text-primary prose-a:no-underline',
        'prose-a:decoration-primary/50 prose-a:underline-offset-4',
        'hover:prose-a:text-primary/80 hover:prose-a:underline',
        'focus:prose-a:outline-2 focus:prose-a:outline-primary focus:prose-a:outline-offset-2',

        // enhanced image styling
        'prose-img:rounded-lg prose-img:border prose-img:border-border',
        'prose-img:shadow-md prose-img:my-4',

        // improved horizontal rule
        'prose-hr:my-6 prose-hr:border-border prose-hr:border-t-2',

        // additional spacing and visual improvements
        '[&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
        'text-foreground selection:bg-primary/20'
      )}
      dangerouslySetInnerHTML={{ __html: server.markdownContent }}
    />
  )
}
