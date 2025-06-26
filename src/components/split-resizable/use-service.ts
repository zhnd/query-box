import { cn } from '@/lib/utils'
import { SplitProps } from 'react-split'

export interface SplitResizableProps extends SplitProps {
  children?: React.ReactNode
  hiddenGutter?: boolean
}

export const useSplitResizableService = (props: SplitResizableProps) => {
  const { gutterStyle, className, hiddenGutter, ...restProps } = props
  const finalGutterStyle = () => ({ ...defaultGutterStyle, ...gutterStyle })

  const splitComponentProps = {
    ...defaultSplitComponentProps,
    ...restProps,
    gutterStyle: finalGutterStyle,
    className: cn('split-resizable', className, {
      'hidden-gutter': hiddenGutter,
    }),
  }
  return {
    defaultSplitComponentProps,
    splitComponentProps,
  }
}

const defaultGutterStyle: Partial<CSSStyleDeclaration> = {
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
  cursor: 'ew-resize',
  gutterStyle: () => defaultGutterStyle,
}
