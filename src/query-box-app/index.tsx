import { TitleBar } from '@/components/titlebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebarMenuItemKeys } from '@/constants'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FC } from 'react'
import { AppSidebar } from './app-sidebar'
import { Endpoint } from './endpoint'
import { Explorer } from './explorer'
import { PageMenubar } from './page-menubar'
import { useAppService } from './use-app-service'
const queryClient = new QueryClient()
export function QueryBoxApp() {
  const appService = useAppService()
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col h-screen">
          <TitleBar />
          <SidebarProvider
            className="flex-1 min-h-0"
            style={
              {
                '--sidebar-width': '16rem',
                '--sidebar-width-icon': '5rem',
              } as React.CSSProperties
            }
          >
            <AppSidebar />
            <main className="flex-1 flex flex-col overflow-y-auto">
              <PageMenubar />
              <div className="main-content flex-1 p-4 flex flex-col min-h-0">
                <MainContentRenderer
                  activeAppSidebarMenuItem={appService.activeAppSidebarMenuItem}
                />
              </div>
            </main>
          </SidebarProvider>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

const MainContentRenderer: FC<{
  activeAppSidebarMenuItem: AppSidebarMenuItemKeys
}> = (props) => {
  switch (props.activeAppSidebarMenuItem) {
    case AppSidebarMenuItemKeys.ENDPOINT:
      return <Endpoint />
    case AppSidebarMenuItemKeys.EXPLORER:
      return <Explorer />
    default:
      return <div>Not Found</div>
  }
}
