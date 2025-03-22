import { DataTable } from '@/components/data-table'
import { DataTableRowActions } from '@/components/data-table/data-table-row-actions'
import { OverflowTooltip } from '@/components/overflow-tooltip'
import { Endpoint } from '@/generated/typeshare-types'
import { ColumnDef } from '@tanstack/react-table'
import { useEndpointListService } from './use-service'

export function EndpointList() {
  const service = useEndpointListService()
  const columns: ColumnDef<Endpoint>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <OverflowTooltip text={row.original.name ?? ''} />,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <OverflowTooltip text={row.original.description ?? ''} />
      ),
    },
    {
      accessorKey: 'url',
      header: 'URL',
      cell: ({ row }) => <OverflowTooltip text={row.original.url ?? ''} />,
    },
    {
      accessorKey: 'endpoint_type',
      header: 'Endpoint Type',
      meta: {
        className: 'w-[150px]',
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      meta: {
        className: 'w-[80px]',
      },
      cell: () => (
        <DataTableRowActions
          actions={[
            {
              label: 'Edit',
              onClick: () => {},
            },
            {
              label: 'Delete',
              onClick: () => {},
            },
          ]}
        />
      ),
    },
  ]

  return (
    <DataTable columns={columns} data={service.endpointsInfo?.items ?? []} />
  )
}
