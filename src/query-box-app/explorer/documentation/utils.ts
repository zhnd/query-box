import { buildClientSchema, getIntrospectionQuery } from 'graphql'

export async function fetchDocumentation(params: { endpointUrl: string }) {
  const { endpointUrl } = params

  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: getIntrospectionQuery(),
      }),
    })

    const { data } = await response.json()
    const clientSchema = buildClientSchema(data)
    console.log('Fetched GraphQL schema:', clientSchema)
  } catch (error) {
    console.error('Error fetching documentation:', error)
    return []
  }
}
