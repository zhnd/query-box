import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CircleArrowUp } from 'lucide-react'
import { usePageMenubarUpdaterService } from './use-service'

export function PageMenubarUpdater() {
  const service = usePageMenubarUpdaterService()
  if (!service.downloadFinished) return null
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-accent hover:text-accent-foreground"
            onClick={service.handleInstallUpdate}
          >
            <CircleArrowUp className="h-4 w-4 animate-bounce" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-orange-500 rounded-full" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-sm">Update available</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
