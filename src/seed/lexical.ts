/** Minimal Lexical root for seed scripts. */
export function lexicalParagraph(text: string) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text,
              version: 1,
            },
          ],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          version: 1,
        },
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

export function richParagraphBlock(text: string) {
  return {
    blockType: 'richParagraph' as const,
    content: lexicalParagraph(text),
  }
}
