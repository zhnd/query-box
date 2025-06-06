import { useService } from './use-service'

export function Documentation() {
  useService()
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-2 py-1 border-b">
        <div className="flex items-center text-sm font-medium">
          Documentation
        </div>
      </div>
    </div>
  )
}
