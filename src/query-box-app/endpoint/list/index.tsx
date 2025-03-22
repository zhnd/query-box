import { DataTable } from '@/components/data-table'
import { OverflowTooltip } from '@/components/overflow-tooltip'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Endpoint } from '@/generated/typeshare-types'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { useEndpointListService } from './use-service'

export function EndpointList() {
  const service = useEndpointListService()
  const columns: ColumnDef<Endpoint>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <OverflowTooltip text={row.original.description ?? ''} />
      ),
      meta: {
        width: '40%',
      },
    },
    {
      accessorKey: 'url',
      header: 'URL',
      meta: {
        width: '30%',
      },
    },
    {
      accessorKey: 'endpoint_type',
      header: 'Endpoint Type',
      meta: {
        width: '30%',
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: () => {
        return (
          <div className="w-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  return (
    <div className="">
      <DataTable columns={columns} data={service.endpointsInfo?.items ?? []} />
    </div>
  )
}
