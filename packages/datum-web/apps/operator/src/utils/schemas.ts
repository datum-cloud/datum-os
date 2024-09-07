import z from 'zod'

import { TEL_REGEX } from '@repo/constants'

export const ContactCreationSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Please enter a valid name')
    .describe('Name of the contact')
    .optional(),
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
    .describe('Lists to which the contact belongs')
    .optional(),
})

export const ContactCreationFormSchema = ContactCreationSchema.extend({
  firstName: z.string().describe('First name of the contact').optional(),
  lastName: z.string().describe('Last name of the contact').optional(),
})

export type ContactCreationInput = z.infer<typeof ContactCreationSchema>

export type ContactCreationFormInput = z.infer<typeof ContactCreationFormSchema>
