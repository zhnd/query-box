import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, X } from 'lucide-react'
import {
  RequestHistoryTabItemContentProps,
  RequestHistoryTabItemViewType,
  useRequestHistoryTabItemContentService,
} from './use-service'

export function RequestHistoryTabItemContent(
  props: RequestHistoryTabItemContentProps
) {
  const { index, requestHistory } = props

  const service = useRequestHistoryTabItemContentService(props)

  if (service.viewType === RequestHistoryTabItemViewType.EDIT) {
    return (
      <div className="flex min-w-0 items-center gap-1.5">
        <Input
          value={service.tabName}
          onChange={service.handleTabNameChange}
          onBlur={service.handleCancelEditTabName}
          onKeyDown={service.handleTagNameInputKeyDown}
          className="h-5 w-60 px-2 text-xs"
          placeholder="Enter name..."
          autoFocus
          disabled={service.updatingRequestHistory}
        />
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 hover:bg-green-100 dark:hover:bg-green-900/20"
            onMouseDown={service.handleSaveTabName}
            disabled={service.updatingRequestHistory}
          >
            <Check className="h-3 w-3 text-green-600 dark:text-green-400 cursor-pointer" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5 w-full min-w-0 group">
      <span
        className="truncate flex-1 text-xs cursor-pointer select-none hover:text-foreground transition-colors"
        onDoubleClick={service.handleEditTabName}
        title={requestHistory.name}
      >
        {requestHistory.name || `Request ${index + 1}`}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 hover:bg-destructive/10 transition-all duration-200"
        onClick={service.handleDeleteRequestHistory}
      >
        <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
      </Button>
    </div>
  )
}
