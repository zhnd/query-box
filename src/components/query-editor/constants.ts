import { OperationTypeNode } from 'graphql'

export const QUERY_EXAMPLE = `
# Welcome to GraphQL Editor - Quick Start
# Learn more about GraphQL at: https://graphql.org/learn/
#
# Tips:
# - Double-click Tab to rename name
# - Use Shift+Space for auto-completion suggestions
# - Use # for comments like this one
`

export const CODE_LENS_EXECUTE_OPERATIONS: OperationTypeNode[] = [
  OperationTypeNode.QUERY,
  OperationTypeNode.MUTATION,
]
