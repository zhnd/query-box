import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { appSidebarMenuItems } from './constants'
import { MenuItem } from './menu-item'
import { useAppSidebarService } from './use-service'

export function AppSidebar() {
  const service = useAppSidebarService()

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="mt-8">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {appSidebarMenuItems.map((item) => (
                <MenuItem
                  item={item}
                  key={item.key}
                  activeKey={service.activeItemKey}
                  onClick={service.updateActiveAppSidebarMenuItemKey}
                />
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
