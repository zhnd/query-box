import { EndpointBridge } from '@/bridges'
import { Endpoint, EndpointType } from '@/generated/typeshare-types'
import { useEndpointConnectivity } from '@/hooks'
import { useEndpointPageStore } from '@/stores'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  createAuthField,
  transformAuthValues,
  transformHeadersToRecord,
} from '../common/utils'

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
  auth: createAuthField(),
})

type FormValues = z.infer<typeof formSchema>

export const useCreateEndpointService = (props: CreateEndpointProps) => {
  const { onCreateSuccess } = props
  const createDialogOpen = useEndpointPageStore(
    (state) => state.createDialogOpen
  )
  const queryClient = useQueryClient()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      url: '',
      headers: [{ id: nanoid(), key: '', value: '' }],
    },
  })

  const setCreateDialogOpen = useEndpointPageStore(
    (state) => state.setCreateDialogOpen
  )

  const {
    loading: checkConnectivityLoading,
    result: checkConnectivityResult,
    cancel: cancelCheckConnectivity,
    checkConnectivity,
  } = useEndpointConnectivity()

  const resetState = () => {
    cancelCheckConnectivity()
    form.reset()
  }

  const mutation = useMutation({
    mutationFn: EndpointBridge.createEndpoint,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['endpoints'] })
      setCreateDialogOpen(false)
      resetState()
      onCreateSuccess?.({
        endpoint: data,
      })
    },
  })

  const onSubmit = async (values: FormValues) => {
    mutation.mutate({
      name: values.name,
      url: values.url,
      endpoint_type: EndpointType.GraphQL,
      auth: transformAuthValues(values.auth),
      headers: values.headers && JSON.stringify(values.headers),
      favorite: false,
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

  const handleSetCreateDialogOpen = (open: boolean) => {
    setCreateDialogOpen(open)
    if (!open) {
      resetState()
    }
  }

  return {
    createDialogOpen,
    handleSetCreateDialogOpen,
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
