import { EndpointBridge } from '@/bridges'
import { useEndpointPageStore } from '@/stores'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  formSchema,
  FormValues,
  getUpdateEndpointFormInitialValues,
} from './update-endpoint-lib'

export const useUpdateEndpointService = () => {
  const endpointId = useEndpointPageStore((state) => state.operateId)
  const setOperateEndpointId = useEndpointPageStore(
    (state) => state.setOperateId
  )
  const updateDialogOpen = useEndpointPageStore(
    (state) => state.updateDialogOpen
  )
  const queryClient = useQueryClient()

  const setUpdateDialogOpen = useEndpointPageStore(
    (state) => state.setUpdateDialogOpen
  )

  const { data: endpoint } = useQuery({
    queryKey: ['endpoint', endpointId],
    queryFn: () => EndpointBridge.getEndpointById(endpointId ?? ''),
  })

  const mutation = useMutation({
    mutationFn: EndpointBridge.updateEndpoint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['endpoints'] })
      setUpdateDialogOpen(false)
      setOperateEndpointId(null)
    },
  })

  const [testStatus, setTestStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [testMessage, setTestMessage] = useState('')

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    const initialValues = getUpdateEndpointFormInitialValues({
      endpoint,
    })
    form.reset(initialValues)
  }, [endpoint])

  const onSubmit = async (values: FormValues) => {
    mutation.mutate({
      id: endpointId ?? '',
      name: values.name,
      url: values.url,
      headers: values.headers && JSON.stringify(values.headers),
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
    updateDialogOpen,
    setUpdateDialogOpen,
    testStatus,
    testMessage,
    form,
    onSubmit,
    testConnection,
    addHeader,
    removeHeader,
  }
}
