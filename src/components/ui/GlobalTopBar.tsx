'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { TopBar } from './TopBar'
import { isDemoMode } from '@/lib/utils/demo'

export const GlobalTopBar = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const isDemo = searchParams.get('mode') === 'demo' || pathname?.startsWith('/demo')
  
  if (isDemo) {
    return null
  }

  // Do not render the TopBar on public landing/auth routes
  const publicRoutes = ['/', '/login', '/signup', '/about', '/contact', '/services']
  if (!pathname || publicRoutes.includes(pathname)) {
    return null
  }

  return <TopBar />
}
