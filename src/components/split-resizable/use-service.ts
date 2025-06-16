import { SplitProps } from 'react-split'

export interface SplitResizableProps extends SplitProps {
  children?: React.ReactNode
}

export const useSplitResizableService = (props: SplitResizableProps) => {
  const { className } = props
  return {
    configs: {
      ...defaultSplitComponentProps,
      ...props,
      className: `split-resizable ${className || ''}`,
    },
  }
}

const gutterStyle: Partial<CSSStyleDeclaration> = {
  paddingLeft: '3px',
  paddingRight: '3px',
  boxSizing: 'content-box',
  height: '100%',
  background:
    'linear-gradient(to right, transparent 3px, var(--border) 3px, var(--border) 4px, transparent 4px)',
}

export const defaultSplitComponentProps: SplitProps = {
  direction: 'horizontal',
  gutterSize: 8,
  minSize: 300,
  gutterStyle: () => gutterStyle,
  cursor: 'ew-resize',
}
