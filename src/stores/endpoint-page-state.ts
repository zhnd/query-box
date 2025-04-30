import { Endpoint } from '@/generated/typeshare-types'
import { create } from 'zustand'

interface EndpointPageStoreState {
  operateEndpoint: Endpoint | null
  createDialogOpen: boolean
  updateDialogOpen: boolean
  deleteDialogOpen: boolean
}

interface EndpointPageStoreActions {
  setOperateEndpoint: (id: Endpoint | null) => void
  setCreateDialogOpen: (open: boolean) => void
  setUpdateDialogOpen: (open: boolean) => void
  setDeleteDialogOpen: (open: boolean) => void
}

type EndpointPageStore = EndpointPageStoreState & EndpointPageStoreActions

export const useEndpointPageStore = create<EndpointPageStore>()((set) => ({
  createDialogOpen: false,
  updateDialogOpen: false,
  deleteDialogOpen: false,
  operateEndpoint: null,
  setOperateEndpoint: (endpoint: Endpoint | null) =>
    set(() => ({ operateEndpoint: endpoint })),
  setCreateDialogOpen: (open) => set(() => ({ createDialogOpen: open })),
  setUpdateDialogOpen: (open) => set(() => ({ updateDialogOpen: open })),
  setDeleteDialogOpen: (open) => set(() => ({ deleteDialogOpen: open })),
}))
