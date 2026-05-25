import type { Field } from 'payload'

const auditFieldAccess = {
  read: ({ req }: { req: { user?: unknown } }) => Boolean(req.user),
  create: () => false,
  update: () => false,
}

export const auditFields: Field[] = [
  {
    name: 'createdBy',
    type: 'relationship',
    relationTo: 'users',
    admin: {
      readOnly: true,
      position: 'sidebar',
    },
    access: auditFieldAccess,
  },
  {
    name: 'updatedBy',
    type: 'relationship',
    relationTo: 'users',
    admin: {
      readOnly: true,
      position: 'sidebar',
    },
    access: auditFieldAccess,
  },
  {
    name: 'publishedBy',
    type: 'relationship',
    relationTo: 'users',
    admin: {
      readOnly: true,
      position: 'sidebar',
    },
    access: auditFieldAccess,
  },
  {
    name: 'firstPublishedAt',
    type: 'date',
    admin: {
      readOnly: true,
      position: 'sidebar',
      date: {
        pickerAppearance: 'dayAndTime',
      },
    },
    access: auditFieldAccess,
  },
]
