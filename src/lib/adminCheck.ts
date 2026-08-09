import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  return session?.user?.email === 'sanketadsare5@gmail.com'
}
