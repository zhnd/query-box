import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { ComponentPropsWithoutRef } from 'react'
import { Button } from '../ui/button'

export interface CreateButtonProps
  extends ComponentPropsWithoutRef<typeof Button> {
  children?: React.ReactNode
}

export function CreateButton(props: CreateButtonProps) {
  const { className, children, ...buttonProps } = props

  return (
    <Button className={cn('cursor-pointer', className)} {...buttonProps}>
      {children ? (
        children
      ) : (
        <>
          Create <Plus />
        </>
      )}
    </Button>
  )
}
