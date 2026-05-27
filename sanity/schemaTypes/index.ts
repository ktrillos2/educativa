import { type SchemaTypeDefinition } from 'sanity'
import { orderType } from './orderType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [orderType],
}
