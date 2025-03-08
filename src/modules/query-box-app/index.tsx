import { SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from './app-sidebar'

export function QueryBoxApp() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main>main</main>
      </SidebarProvider>
    </TooltipProvider>
  )
}
