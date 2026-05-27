import { BlocksFeature, TextStateFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { articleLexicalBlocks } from '../blocks'
import { articleTextStateConfig } from './articleTextStateConfig'

export const articleLexicalEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    TextStateFeature({ state: articleTextStateConfig }),
    BlocksFeature({ blocks: articleLexicalBlocks }),
  ],
})
