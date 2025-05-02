import { EndpointBridge } from '@/bridges'
import { Endpoint, EndpointType } from '@/generated/typeshare-types'
import { useEndpointPageStore } from '@/stores'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export interface CreateEndpointProps {
  onCreateSuccess?: (data: { endpoint: Endpoint }) => void
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Must be a valid URL'),
  headers: z
    .array(
      z.object({
        id: z.string(),
        key: z.string(),
        value: z.string(),
      })
    )
    .optional(),
})

type FormValues = z.infer<typeof formSchema>

export const useCreateEndpointService = (props: CreateEndpointProps) => {
  const { onCreateSuccess } = props
  const createDialogOpen = useEndpointPageStore(
    (state) => state.createDialogOpen
  )
  const queryClient = useQueryClient()

  const setCreateDialogOpen = useEndpointPageStore(
    (state) => state.setCreateDialogOpen
  )

  const mutation = useMutation({
    mutationFn: EndpointBridge.createEndpoint,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['endpoints'] })
      setCreateDialogOpen(false)
      onCreateSuccess?.({
        endpoint: data,
      })
    },
  })

  const [testStatus, setTestStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [testMessage, setTestMessage] = useState('')

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      url: '',
      headers: [{ id: nanoid(), key: '', value: '' }],
    },
  })

  const onSubmit = async (values: FormValues) => {
    mutation.mutate({
      name: values.name,
      url: values.url,
      endpoint_type: EndpointType.GraphQL,
      headers: values.headers && JSON.stringify(values.headers),
      favorite: false,
    })
  }

  const testConnection = async () => {
    setTestStatus('loading')
    try {
      // Mock API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setTestStatus('success')
      setTestMessage('Successfully connected to the GraphQL endpoint!')
    } catch (error) {
      console.error('Failed to connect:', error)
      setTestStatus('error')
      setTestMessage(
        'Failed to connect to the endpoint. Please check the URL and headers.'
      )
    }
  }

  const addHeader = () => {
    const currentHeaders = form.getValues('headers') || []
    form.setValue('headers', [
      ...currentHeaders,
      { id: nanoid(), key: '', value: '' },
    ])
  }

  const removeHeader = (index: number) => {
    const currentHeaders = form.getValues('headers') || []
    form.setValue(
      'headers',
      currentHeaders.filter((_, i) => i !== index)
    )
  }

  return {
    createDialogOpen,
    setCreateDialogOpen,
    testStatus,
    testMessage,
    form,
    onSubmit,
    testConnection,
    addHeader,
    removeHeader,
  }
}
