import type { CollectionConfig } from 'payload'

import { siteSettingsAccess } from '../access'
import {
  revalidateSiteSettings,
  revalidateSiteSettingsDelete,
} from '../hooks/revalidateSite'

const pageLabelFields = [
  { name: 'title', type: 'text' as const },
  { name: 'description', type: 'textarea' as const },
]

export const SiteSettings: CollectionConfig = {
  slug: 'site-settings',
  labels: {
    singular: 'Site Settings',
    plural: 'Site Settings',
  },
  admin: {
    useAsTitle: 'site',
    defaultColumns: ['site', 'updatedAt'],
  },
  access: siteSettingsAccess,
  hooks: {
    afterChange: [revalidateSiteSettings],
    afterDelete: [revalidateSiteSettingsDelete],
  },
  indexes: [
    {
      fields: ['site'],
      unique: true,
    },
  ],
  fields: [
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'brandName',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: '灵虾',
    },
    {
      name: 'themePreset',
      type: 'select',
      required: true,
      defaultValue: 'lingxia-gold',
      options: [
        { label: 'Lingxia Gold (default)', value: 'lingxia-gold' },
        { label: 'Lingxia Jade', value: 'lingxia-jade' },
        { label: 'Lingxia Festival', value: 'lingxia-festival' },
      ],
      admin: {
        description: 'Site-wide color theme for lingxia_home',
      },
    },
    {
      name: 'defaultSeo',
      type: 'group',
      localized: true,
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
        },
        {
          name: 'metaDescription',
          type: 'textarea',
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'pageLabels',
      type: 'group',
      localized: true,
      fields: [
        { name: 'blog', type: 'group', fields: pageLabelFields },
        { name: 'faq', type: 'group', fields: pageLabelFields },
        { name: 'characters', type: 'group', fields: pageLabelFields },
      ],
    },
    {
      name: 'downloadLinks',
      type: 'group',
      localized: true,
      fields: [
        {
          name: 'appStore',
          type: 'group',
          fields: [
            {
              name: 'label',
              type: 'text',
              defaultValue: 'App Store',
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                description: 'Leave empty to use NEXT_PUBLIC_APP_STORE_URL from home .env',
              },
            },
            {
              name: 'icon',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'SVG/PNG recommended (~20px). Falls back to home /social/applelogo.svg',
              },
            },
          ],
        },
        {
          name: 'android',
          type: 'group',
          fields: [
            {
              name: 'label',
              type: 'text',
              defaultValue: 'Android',
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                description: 'Leave empty to use NEXT_PUBLIC_ANDROID_URL from home .env',
              },
            },
            {
              name: 'icon',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'SVG/PNG recommended (~20px). Falls back to home /social/adrlogo.svg',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'WeChat', value: 'wechat' },
            { label: 'Weibo', value: 'weibo' },
            { label: 'Xiaohongshu', value: 'xiaohongshu' },
            { label: 'Douyin', value: 'douyin' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Optional. Falls back to bundled icon in home /public/social/ by platform',
          },
        },
      ],
    },
    {
      name: 'footerCopy',
      type: 'richText',
      localized: true,
    },
    {
      name: 'homeSeoParagraph',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Plain text for noscript / GEO fallback on the home page',
      },
    },
  ],
}
