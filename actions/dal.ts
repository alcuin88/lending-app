import 'server-only'
 
import { cookies } from 'next/headers'
import { validateSessionToken } from '@/lib/auth'
import { cache } from 'react'
import { redirect } from 'next/navigation'
 
export const verifySession = cache(async () => {
  const token = (await cookies()).get('session')?.value as string
 
  console.log(`token: ${token}`)

  if (!token) {
    redirect('/')
  }
 
  return await validateSessionToken(token)
})