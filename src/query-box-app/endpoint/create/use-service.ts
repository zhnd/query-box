import { EndpointBridge } from '@/bridges'
import { Endpoint, EndpointType } from '@/generated/typeshare-types'
import { useEndpointConnectivity } from '@/hooks'
import { useEndpointPageStore } from '@/stores'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
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

  const {
    loading: checkConnectivityLoading,
    result: checkConnectivityResult,
    checkConnectivity,
  } = useEndpointConnectivity()

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
    await checkConnectivity({
      url: form.getValues('url'),
      headers: form.getValues('headers')?.reduce(
        (acc, header) => {
          if (header.key && header.value) {
            acc[header.key] = header.value
          }
          return acc
        },
        {} as Record<string, string>
      ),
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

  return {
    createDialogOpen,
    setCreateDialogOpen,
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
