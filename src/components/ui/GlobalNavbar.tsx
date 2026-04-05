'use client'
import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'

export const GlobalNavbar = () => {
  const pathname = usePathname()
  
  // Only render the Navbar explicitly on the public marketing routes
  const publicRoutes = ['/', '/about', '/contact', '/services']
  if (!pathname || !publicRoutes.includes(pathname)) {
    return null
  }

  return <Navbar />
}
