import { Endpoint } from '@/generated/typeshare-types'
import { nanoid } from 'nanoid'
import { z } from 'zod'

export interface UpdateEndpointProps {
  endpointId: string
  onUpdateSuccess?: () => void
  onUpdateError?: (error: Error) => void
}

export const formSchema = z.object({
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

export type FormValues = z.infer<typeof formSchema>

const getInitialHeaders = (params: { endpoint: Endpoint | undefined }) => {
  const { endpoint } = params
  const defaultHeaders = [{ id: nanoid(), key: '', value: '' }]
  if (!endpoint) {
    return defaultHeaders
  }

  try {
    const parsedHeaders = JSON.parse(endpoint.headers ?? '')
    return parsedHeaders.length > 0 ? parsedHeaders : defaultHeaders
  } catch (error) {
    console.error('Failed to parse headers:', error)
    return defaultHeaders
  }
}

export const getUpdateEndpointFormInitialValues = (params: {
  endpoint: Endpoint | undefined
}): FormValues => {
  const { endpoint } = params
  return {
    name: endpoint?.name ?? '',
    url: endpoint?.url ?? '',
    headers: getInitialHeaders({ endpoint }),
  }
}
