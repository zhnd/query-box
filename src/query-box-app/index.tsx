import { TitleBar } from '@/components/titlebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/providers'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppSidebar } from './app-sidebar'
import { Endpoint } from './endpoint'
import { PageMenubar } from './page-menubar'
const queryClient = new QueryClient()
export function QueryBoxApp() {
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
                  <div className="flex-1 overflow-auto p-4">
                    <Endpoint />
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
