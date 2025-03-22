import { Plus } from 'lucide-react'
import { Button } from '../ui/button'

export interface CreateButtonProps {
  children?: React.ReactNode
  onClick?: () => void | Promise<void>
  disabled?: boolean
}

export function CreateButton(props: CreateButtonProps) {
  const { onClick, children, disabled } = props

  return (
    <Button disabled={disabled} onClick={onClick} className="cursor-pointer">
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
