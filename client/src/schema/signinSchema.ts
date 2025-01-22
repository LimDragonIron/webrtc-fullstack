import * as z from 'zod'

export const signinSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'This field has to be filled.' })
    .email('This is not a valid email.'),
  password: z.string().min(4, {
    message: 'Please enter a password of at least 8 characters'
  })
})

export type LoginPayLoad = z.infer<typeof signinSchema>

export const AccountInfo = z.object({
  email: z.string(),
  name: z.string(),
  access_token: z.string()
})

export type Account = z.infer<typeof AccountInfo>

export const LoginReseponse = z.object({
  data: z.object({
    email: z.string(),
    name: z.string(),
    access_token: z.string()
  }).required(),
  message: z.string(),
  code: z.string(),
  meta: z.string().optional(),
})

export type LoginReseponse = z.infer<typeof LoginReseponse>