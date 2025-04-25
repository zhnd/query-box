import { create } from 'zustand'

interface EndpointPageStoreState {
  operateId: string | null
  createDialogOpen: boolean
  updateDialogOpen: boolean
}

interface EndpointPageStoreActions {
  setOperateId: (id: string | null) => void
  setCreateDialogOpen: (open: boolean) => void
  setUpdateDialogOpen: (open: boolean) => void
}

type EndpointPageStore = EndpointPageStoreState & EndpointPageStoreActions

export const useEndpointPageStore = create<EndpointPageStore>()((set) => ({
  createDialogOpen: false,
  updateDialogOpen: false,
  operateId: null,
  setOperateId: (id: string | null) => set(() => ({ operateId: id })),
  setCreateDialogOpen: (open) => set(() => ({ createDialogOpen: open })),
  setUpdateDialogOpen: (open) => set(() => ({ updateDialogOpen: open })),
}))
