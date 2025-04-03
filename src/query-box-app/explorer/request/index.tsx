import { QueryEditor } from '@/components/query-editor'
import { Button } from '@/components/ui/button'

export function Request() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-2 py-1 border-b">
        <div className="flex items-center text-sm font-medium">Operation</div>

        <Button variant="outline" className="cursor-pointer">
          Run
        </Button>
      </div>
      <QueryEditor />
    </div>
  )
}
