import { AuthType } from '@/generated/typeshare-types'
import z from 'zod'

export function transformAuthValues<
  T extends { auth_type?: AuthType; username?: string; password?: string },
>(auth?: T) {
  if (!auth?.auth_type) {
    return
  }

  return {
    auth_type: auth.auth_type,
    username: auth.username?.trim() ?? '',
    password: auth.password?.trim() ?? '',
  }
}

export function createAuthField() {
  return z
    .object({
      auth_type: z.nativeEnum(AuthType).optional(),
      username: z.string().max(100).optional(),
      password: z.string().max(200).optional(),
    })
    .optional()
    .superRefine((auth, ctx) => {
      if (auth?.auth_type === AuthType.Basic) {
        if (!auth.username || auth.username.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Username is required for Basic authentication',
            path: ['username'],
          })
        }

        if (!auth.password || auth.password.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Password is required for Basic authentication',
            path: ['password'],
          })
        }
      }
    })
}
