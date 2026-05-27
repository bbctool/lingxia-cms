import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { articleLexicalBlocks } from '../blocks'

export const articleLexicalEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    BlocksFeature({ blocks: articleLexicalBlocks }),
  ],
})
