import MarkdownIt from 'markdown-it'
export const markdown = new MarkdownIt({
  breaks: false,
  linkify: true,
})
