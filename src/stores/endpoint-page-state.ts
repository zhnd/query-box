import { create } from 'zustand'

interface EndpointPageStoreState {
  createDialogOpen: boolean
}

interface EndpointPageStoreActions {
  setCreateDialogOpen: (open: boolean) => void
}

type EndpointPageStore = EndpointPageStoreState & EndpointPageStoreActions

export const useEndpointPageStore = create<EndpointPageStore>()((set) => ({
  createDialogOpen: false,
  setCreateDialogOpen: (open) => set(() => ({ createDialogOpen: open })),
}))
