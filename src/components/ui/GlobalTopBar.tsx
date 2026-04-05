'use client'
import { usePathname } from 'next/navigation'
import { TopBar } from './TopBar'

export const GlobalTopBar = () => {
  const pathname = usePathname()
  
  // Do not render the TopBar on public landing/auth routes
  const publicRoutes = ['/', '/login', '/signup', '/about', '/contact', '/services']
  if (!pathname || publicRoutes.includes(pathname)) {
    return null
  }

  return <TopBar />
}
