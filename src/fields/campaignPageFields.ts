import type { Field } from 'payload'

const isCampaign = (_: unknown, siblingData: { layout?: string }) =>
  siblingData?.layout === 'campaign'

type CampaignSibling = {
  layout?: string
  htmlBody?: string | null
  htmlFile?: unknown
}

export const campaignPageFields: Field[] = [
  {
    name: 'showInNav',
    type: 'checkbox',
    defaultValue: false,
    admin: {
      condition: isCampaign,
      description: 'Show this campaign in the site header navigation',
    },
  },
  {
    name: 'navLabel',
    type: 'text',
    localized: true,
    admin: {
      condition: isCampaign,
      description: 'Header link text (falls back to page title when empty)',
    },
  },
  {
    name: 'navSort',
    type: 'number',
    defaultValue: 100,
    admin: {
      condition: isCampaign,
      description: 'Lower numbers appear first in the header',
    },
  },
  {
    name: 'htmlFile',
    type: 'upload',
    relationTo: 'media',
    localized: true,
    admin: {
      condition: isCampaign,
      description:
        'Upload a .html file, or paste HTML below. When both are set, the file wins.',
    },
    validate: (
      value: unknown,
      { siblingData }: { siblingData: CampaignSibling },
    ) => {
      if (siblingData?.layout !== 'campaign') return true
      if (value || siblingData.htmlBody?.trim()) return true
      return 'Provide an HTML file or HTML Body text'
    },
  },
  {
    name: 'htmlBody',
    type: 'textarea',
    localized: true,
    admin: {
      condition: isCampaign,
      description: 'Paste HTML here if you are not uploading a file',
    },
    validate: (
      value: unknown,
      { siblingData }: { siblingData: CampaignSibling },
    ) => {
      if (siblingData?.layout !== 'campaign') return true
      if (siblingData.htmlFile || (typeof value === 'string' && value.trim())) {
        return true
      }
      return 'Provide an HTML file or HTML Body text'
    },
  },
  {
    name: 'openInNewTab',
    type: 'checkbox',
    defaultValue: false,
    admin: {
      condition: isCampaign,
      description: 'Open the header link in a new browser tab',
    },
  },
]
