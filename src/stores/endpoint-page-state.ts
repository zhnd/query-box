import { Endpoint } from '@/generated/typeshare-types'
import { create } from 'zustand'

interface SearchQuery {
  filterString?: string
}

interface EndpointPageStoreState {
  operateEndpoint: Endpoint | null
  createDialogOpen: boolean
  updateDialogOpen: boolean
  deleteDialogOpen: boolean
  searchQuery?: SearchQuery
}

interface EndpointPageStoreActions {
  setOperateEndpoint: (id: Endpoint | null) => void
  setCreateDialogOpen: (open: boolean) => void
  setUpdateDialogOpen: (open: boolean) => void
  setDeleteDialogOpen: (open: boolean) => void
  setSearchQuery: (query: SearchQuery) => void
  reset: () => void
}

type EndpointPageStore = EndpointPageStoreState & EndpointPageStoreActions

const INITIAL_STATE: EndpointPageStoreState = {
  createDialogOpen: false,
  updateDialogOpen: false,
  deleteDialogOpen: false,
  operateEndpoint: null,
  searchQuery: undefined,
}

export const useEndpointPageStore = create<EndpointPageStore>()((set) => ({
  ...INITIAL_STATE,
  setOperateEndpoint: (endpoint: Endpoint | null) =>
    set(() => ({ operateEndpoint: endpoint })),
  setCreateDialogOpen: (open) => set(() => ({ createDialogOpen: open })),
  setUpdateDialogOpen: (open) => set(() => ({ updateDialogOpen: open })),
  setDeleteDialogOpen: (open) => set(() => ({ deleteDialogOpen: open })),
  setSearchQuery: (searchQuery) => set(() => ({ searchQuery })),
  reset: () => set(() => ({ ...INITIAL_STATE })),
}))
