import type { CollectionConfig } from 'payload'

import { sitesAccess } from '../access'
import { DEFAULT_LOCALE, LOCALE_OPTIONS } from '../config/locales'

export const Sites: CollectionConfig = {
  slug: 'sites',
  labels: {
    singular: 'Site',
    plural: 'Sites',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'primaryDomain', 'defaultLocale'],
  },
  access: sitesAccess,
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Stable key for CONTENT_SITE_SLUG (e.g. lingxia)',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'primaryDomain',
      type: 'text',
      required: true,
      admin: {
        description: 'Canonical site URL without trailing slash',
      },
    },
    {
      name: 'defaultLocale',
      type: 'select',
      required: true,
      defaultValue: DEFAULT_LOCALE,
      options: LOCALE_OPTIONS,
    },
    {
      name: 'enabledLocales',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: [DEFAULT_LOCALE, 'en'],
      options: LOCALE_OPTIONS,
    },
  ],
}
