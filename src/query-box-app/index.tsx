import { TitleBar } from '@/components/titlebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebarMenuItemKeys } from '@/constants'
import { AppProvider } from '@/providers'
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
        <AppProvider>
          <div className="flex flex-col h-screen overflow-hidden">
            <TitleBar />
            <div className="flex flex-1 min-h-0">
              <SidebarProvider
                style={
                  {
                    '--sidebar-width': '16rem',
                    '--sidebar-width-icon': '5rem',
                  } as React.CSSProperties
                }
              >
                <AppSidebar />
                <main className="flex flex-col flex-1 min-w-0">
                  <PageMenubar />
                  <div className="flex-1 p-4">
                    <MainContentRenderer
                      activeAppSidebarMenuItem={
                        appService.activeAppSidebarMenuItem
                      }
                    />
                  </div>
                </main>
              </SidebarProvider>
            </div>
          </div>
        </AppProvider>
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
