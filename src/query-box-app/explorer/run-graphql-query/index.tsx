import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Loader2 } from 'lucide-react'
import { RUN_BUTTON_TEXT, runGraphQLQueryProps } from './types'

export function RunGraphQLQuery(props: runGraphQLQueryProps) {
  const { codelensOperations, isPending, handleRunGraphQLQuery } = props

  if (codelensOperations.length > 1) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">{RUN_BUTTON_TEXT}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            {codelensOperations.map((operation, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => handleRunGraphQLQuery(operation)}
              >
                {operation.definitionNameValue}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  return (
    <Button
      variant="outline"
      className="cursor-pointer"
      onClick={() => handleRunGraphQLQuery()}
      disabled={isPending}
    >
      {isPending ? <Loader2 className="animate-spin" /> : null}
      {RUN_BUTTON_TEXT}
    </Button>
  )
}
