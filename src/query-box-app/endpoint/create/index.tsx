import { Alert, AlertDescription } from '@/components/ui/alert'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Play, Plus, Save, Trash } from 'lucide-react'
import { useCreateEndpointService } from './use-service'

export function CreateEndpoint() {
  const service = useCreateEndpointService()

  return (
    <Dialog
      open={service.createDialogOpen}
      onOpenChange={service.setCreateDialogOpen}
    >
      <DialogContent className="sm:max-w-md md:max-w-lg flex flex-col max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Create GraphQL Endpoint</DialogTitle>
          <DialogDescription>
            Configure a new GraphQL endpoint to query data from external
            sources.
          </DialogDescription>
        </DialogHeader>

        <Form {...service.form}>
          <form
            onSubmit={service.form.handleSubmit(service.onSubmit)}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 min-h-0 overflow-y-auto pr-2 -mr-2 space-y-4">
              <FormField
                control={service.form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My GraphQL API" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={service.form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GraphQL URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://api.example.com/graphql"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>Headers (Optional)</Label>
                <div className="space-y-3">
                  {service.form.watch('headers')?.map((header, index) => (
                    <div key={header.id} className="flex items-center gap-2">
                      <Input
                        placeholder="Key"
                        {...service.form.register(`headers.${index}.key`)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        {...service.form.register(`headers.${index}.value`)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        onClick={() => service.removeHeader(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 cursor-pointer"
                    onClick={service.addHeader}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Header
                  </Button>
                </div>
              </div>

              {service.testStatus !== 'idle' && (
                <Alert
                  className={
                    service.testStatus === 'success'
                      ? 'bg-green-50 text-green-800 border-green-200'
                      : service.testStatus === 'error'
                        ? 'bg-red-50 text-red-800 border-red-200'
                        : 'bg-blue-50 text-blue-800 border-blue-200'
                  }
                >
                  <AlertDescription>
                    {service.testStatus === 'loading'
                      ? 'Testing connection...'
                      : service.testMessage}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter className="flex-none justify-between items-center pt-4 border-t mt-4">
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={service.testConnection}
                  className="mr-2"
                  disabled={service.testStatus === 'loading'}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
              </div>
              <div className="space-x-2">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="cursor-pointer">
                  <Save className="h-4 w-4 mr-2" />
                  Save Endpoint
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
