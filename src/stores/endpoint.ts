import { create } from 'zustand'

interface EndpointStoreState {
  createDialogOpen: boolean
}

interface EndpointStoreActions {
  setCreateDialogOpen: (open: boolean) => void
}

type EndpointStore = EndpointStoreState & EndpointStoreActions

export const useEndpointStore = create<EndpointStore>()((set) => ({
  createDialogOpen: false,
  setCreateDialogOpen: (open) => set(() => ({ createDialogOpen: open })),
}))
