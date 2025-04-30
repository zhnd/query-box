import { OverflowTooltip } from '@/components/overflow-tooltip'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle, Trash2 } from 'lucide-react'
import { useDeleteEndpointService } from './use-service'

export function DeleteEndpoint() {
  const service = useDeleteEndpointService()

  return (
    <Dialog
      open={service.deleteDialogOpen}
      onOpenChange={service.setDeleteDialogOpen}
    >
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Delete Endpoint</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Are you sure you want to delete this endpoint? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 p-3 border rounded-md bg-muted/30 min-w-0">
          <h4 className="font-medium text-sm mb-2 text-muted-foreground">
            Endpoint details:
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium min-w-16">Name:</span>
              <OverflowTooltip text={service.endpoint?.name ?? ''} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium min-w-16">URL:</span>
              <OverflowTooltip text={service.endpoint?.url ?? ''} />
            </div>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between gap-2 pt-2 border-t mt-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            variant="destructive"
            className="cursor-pointer"
            onClick={service.onSubmit}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Endpoint
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
