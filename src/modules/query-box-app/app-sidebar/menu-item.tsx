import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { MenuItemProps } from './types'

export function MenuItem(props: MenuItemProps) {
  const { item, activeKey, onClick } = props
  const { state } = useSidebar()
  const isExpanded = state === 'expanded'
  const isActive = item.key === activeKey

  const menuItemContent = (
    <SidebarMenuItem onClick={() => onClick(item.key)}>
      <SidebarMenuButton asChild isActive={isActive}>
        <a href="#">
          {item.icon}
          <span>{item.title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )

  if (isExpanded) {
    return menuItemContent
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{menuItemContent}</TooltipTrigger>
      <TooltipContent
        forceMount
        side="right"
        className="group-data-[state=expanded]:hidden"
      >
        {item.title}
      </TooltipContent>
    </Tooltip>
  )
}
