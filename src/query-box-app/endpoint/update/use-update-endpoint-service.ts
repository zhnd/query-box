import { EndpointBridge } from '@/bridges'
import { useEndpointConnectivity } from '@/hooks'
import { useEndpointPageStore } from '@/stores'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { transformAuthValues, transformHeadersToRecord } from '../common/utils'
import {
  formSchema,
  FormValues,
  getUpdateEndpointFormInitialValues,
  UpdateEndpointProps,
} from './update-endpoint-lib'

export const useUpdateEndpointService = (data: UpdateEndpointProps) => {
  const { endpointId, onUpdateSuccess, onUpdateError } = data
  const setOperateEndpoint = useEndpointPageStore(
    (state) => state.setOperateEndpoint
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
    queryFn: () => EndpointBridge.getEndpointById(endpointId),
  })

  const mutation = useMutation({
    mutationFn: EndpointBridge.updateEndpoint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['endpoints'] })
      setUpdateDialogOpen(false)
      resetState()
      onUpdateSuccess?.()
    },
    onError: (error: Error) => {
      onUpdateError?.(error)
    },
  })

  const {
    loading: checkConnectivityLoading,
    result: checkConnectivityResult,
    cancel: cancelCheckConnectivity,
    checkConnectivity,
  } = useEndpointConnectivity()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  })

  const resetState = () => {
    cancelCheckConnectivity()
    setOperateEndpoint(null)
  }

  useEffect(() => {
    const initialValues = getUpdateEndpointFormInitialValues({
      endpoint,
    })
    form.reset(initialValues)
  }, [endpoint])

  const onSubmit = async (values: FormValues) => {
    mutation.mutate({
      id: endpointId,
      name: values.name,
      url: values.url,
      auth: transformAuthValues(values.auth),
      headers: values.headers && JSON.stringify(values.headers),
    })
  }

  const testConnection = async () => {
    await checkConnectivity({
      url: form.getValues('url'),
      auth: transformAuthValues(form.getValues('auth')),
      headers: transformHeadersToRecord(form.getValues('headers')),
    })
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

  const handleSetUpdateDialogOpen = (open: boolean) => {
    setUpdateDialogOpen(open)
    if (!open) {
      resetState()
    }
  }

  return {
    updateDialogOpen,
    handleSetUpdateDialogOpen,
    checkConnectivityLoading,
    checkConnectivityResult,
    form,
    onSubmit,
    testConnection,
    addHeader,
    removeHeader,
    disableTestConnection: !form.watch('url') || checkConnectivityLoading,
  }
}
