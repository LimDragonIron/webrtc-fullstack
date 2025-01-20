import * as z from 'zod'

export const signinSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'This field has to be filled.' })
    .email('This is not a valid email.'),
  password: z.string().min(8, {
    message: 'Please enter a password of at least 8 characters'
  })
})
