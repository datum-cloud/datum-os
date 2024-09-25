import z from 'zod'

import { TEL_REGEX } from '@repo/constants'

export const ContactSchema = z.object({
  id: z.string().describe('Contact ID').optional(),
  fullName: z.string().describe('Name of the contact').optional(),
  title: z
    .string()
    .min(2, 'Please enter a valid title')
    .describe('Job title of the contact')
    .optional(),
  company: z
    .string()
    .min(2, 'Please enter a valid company')
    .describe('Name of the company the contact works for')
    .optional(),
  email: z
    .string()
    .email('Please enter a valid email')
    .describe('Email of the contact'),
  address: z
    .string()
    .min(2, 'Please enter a valid address')
    .describe('Address of the contact')
    .optional(),
  phoneNumber: z
    .string()
    .regex(TEL_REGEX, 'Please enter a valid phone number')
    .describe('Phone number of the contact')
    .optional(),
  source: z
    .string()
    .min(2, 'Please enter a valid source')
    .describe('Source where the contact was acquired')
    .optional(),
  status: z.string().describe('Contact status'),
  lists: z
    .array(z.string())
    .describe('IDs of the lists to which the contact belongs')
    .optional(),
})

export const ContactFormSchema = ContactSchema.extend({
  firstName: z.string().describe('First name of the contact').optional(),
  lastName: z.string().describe('Last name of the contact').optional(),
})

export const ContactBatchCreateSchema = z.object({
  contacts: z.array(ContactSchema),
})

export const ContactFilterFormSchema = z.object({
  filters: z.record(
    z.string().describe('Field to query from the Contact'),
    z.object({
      value: z.any().describe('Query value'),
      operator: z
        .enum([
          'equals',
          'doesNotEqual',
          'contains',
          'doesNotContain',
          'greaterThan',
          'greaterThanOrEqualTo',
          'lessThan',
          'lessThanOrEqualTo',
          'empty',
        ])
        .describe('Operator to use for the query'),
    }),
  ),
})

export const SearchFormSchema = z.object({
  query: z.string().describe('The search query').optional(),
})

export const DeletionSchema = z.object({
  deletionText: z.string().describe('Text to confirm deletion'),
})

export const ListSchema = z.object({
  id: z.string().describe('List ID').optional(),
  name: z
    .string()
    .min(2, 'Please enter a valid name')
    .describe('Name of the list'),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).describe('Visibility of the list'),
  description: z.string().describe('Description of the list').optional(),
  members: z
    .array(z.any().describe('List member ID'))
    .optional()
    .default([])
    .describe('Array of the list members'),
})

export const RegisterUserSchema = z.object({
  username: z.string(),
  password: z.string(),
  confirmedPassword: z.string().optional(),
})

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>
export type ContactBatchCreateInput = z.infer<typeof ContactBatchCreateSchema>
export type ContactInput = z.infer<typeof ContactSchema>
export type ContactFilterInput = z.infer<typeof ContactFilterFormSchema>
export type ContactFormInput = z.infer<typeof ContactFormSchema>
export type SearchFormInput = z.infer<typeof SearchFormSchema>
export type DeletionInput = z.infer<typeof DeletionSchema>
export type ListInput = z.infer<typeof ListSchema>
