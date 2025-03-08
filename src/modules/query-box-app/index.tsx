import { SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/providers'
import { AppSidebar } from './app-sidebar'
import { PageMenubar } from './page-menubar'

export function QueryBoxApp() {
  return (
    <TooltipProvider>
      <AppProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 flex flex-col w-screen h-screen">
            <PageMenubar />
          </main>
        </SidebarProvider>
      </AppProvider>
    </TooltipProvider>
  )
}
