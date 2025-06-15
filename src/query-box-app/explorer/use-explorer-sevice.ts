import { useGraphQLExplorerPageStore } from '@/stores'
import { SplitProps } from 'react-split'

export const useExplorerService = () => {
  const { response } = useGraphQLExplorerPageStore()

  return { response }
}

const gutterStyle: Partial<CSSStyleDeclaration> = {
  paddingLeft: '3px',
  paddingRight: '3px',
  boxSizing: 'content-box',
  height: '100%',
  cursor: 'col-resize',
  background:
    'linear-gradient(to right, transparent 3px, var(--border) 3px, var(--border) 4px, transparent 4px)',
}

export const splitComponentProps: SplitProps = {
  direction: 'horizontal',
  gutterSize: 8,
  minSize: 300,
  gutterStyle: () => gutterStyle,
}
