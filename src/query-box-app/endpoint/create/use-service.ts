import { EndpointBridge } from '@/bridges'
import { EndpointType } from '@/generated/typeshare-types'
import { useEndpointStore } from '@/stores'
import { zodResolver } from '@hookform/resolvers/zod'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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

export const useCreateEndpointService = () => {
  const createDialogOpen = useEndpointStore((state) => state.createDialogOpen)
  const setCreateDialogOpen = useEndpointStore(
    (state) => state.setCreateDialogOpen
  )

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
    console.log('Form submitted:', values)
    await EndpointBridge.createEndpoint({
      name: values.name,
      url: values.url,
      endpoint_type: EndpointType.GraphQL,
      headers: values.headers && JSON.stringify(values.headers),
      favorite: false,
    })
    setCreateDialogOpen(false)
  }

  const testConnection = async () => {
    const values = form.getValues()
    console.log('Testing connection:', values)
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
