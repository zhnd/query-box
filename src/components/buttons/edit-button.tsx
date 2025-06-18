import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { ComponentPropsWithoutRef } from 'react'
import { Button } from '../ui/button'

export interface EditButtonProps
  extends ComponentPropsWithoutRef<typeof Button> {
  children?: React.ReactNode
}

export function EditButton(props: EditButtonProps) {
  const { className, children, ...buttonProps } = props

  return (
    <Button className={cn('cursor-pointer', className)} {...buttonProps}>
      {children ? (
        children
      ) : (
        <>
          Edit <Plus />
        </>
      )}
    </Button>
  )
}
