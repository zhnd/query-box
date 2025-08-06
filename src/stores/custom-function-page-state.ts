import { CustomFunction } from '@/generated/typeshare-types'
import { create } from 'zustand'

interface SearchQuery {
  filterString?: string
}

interface CustomFunctionPageStoreState {
  operateFunction: CustomFunction | null
  createDialogOpen: boolean
  updateDialogOpen: boolean
  deleteDialogOpen: boolean
  searchQuery?: SearchQuery
}

interface CustomFunctionPageStoreActions {
  setOperateFunction: (id: CustomFunction | null) => void
  setCreateDialogOpen: (open: boolean) => void
  setUpdateDialogOpen: (open: boolean) => void
  setDeleteDialogOpen: (open: boolean) => void
  setSearchQuery: (query: SearchQuery) => void
  reset: () => void
}

type CustomFunctionPageStore = CustomFunctionPageStoreState &
  CustomFunctionPageStoreActions

const INITIAL_STATE: CustomFunctionPageStoreState = {
  createDialogOpen: false,
  updateDialogOpen: false,
  deleteDialogOpen: false,
  operateFunction: null,
  searchQuery: undefined,
}

export const useCustomFunctionPageStore = create<CustomFunctionPageStore>()(
  (set) => ({
    ...INITIAL_STATE,
    setOperateFunction: (endpoint: CustomFunction | null) =>
      set(() => ({ operateFunction: endpoint })),
    setCreateDialogOpen: (open) => set(() => ({ createDialogOpen: open })),
    setUpdateDialogOpen: (open) => set(() => ({ updateDialogOpen: open })),
    setDeleteDialogOpen: (open) => set(() => ({ deleteDialogOpen: open })),
    setSearchQuery: (searchQuery) => set(() => ({ searchQuery })),
    reset: () => set(() => ({ ...INITIAL_STATE })),
  })
)
