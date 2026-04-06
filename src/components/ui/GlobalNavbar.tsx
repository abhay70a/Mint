'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { Navbar } from './Navbar'
import { isDemoMode } from '@/lib/utils/demo'

export const GlobalNavbar = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const isDemo = searchParams.get('mode') === 'demo' || pathname?.startsWith('/demo')
  
  if (isDemo) {
    return null
  }

  // Only render the Navbar explicitly on the public marketing routes
  const publicRoutes = ['/', '/about', '/contact', '/services']
  if (!pathname || !publicRoutes.includes(pathname)) {
    return null
  }

  return <Navbar />
}
