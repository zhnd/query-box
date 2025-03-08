import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { appSidebarMenuItems } from './constants'
import { MenuItem } from './menu-item'

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <header className="flex items-center justify-between group-data-[state=collapsed]:hidden">
          <h1 className="text-2xl font-bold">Query Box</h1>
          <SidebarTrigger />
        </header>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {appSidebarMenuItems.map((item) => (
                <MenuItem item={item} key={item.key} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <SidebarTrigger className="w-full group-data-[state=expanded]:hidden" />
    </Sidebar>
  )
}
