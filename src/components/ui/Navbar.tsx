'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import dynamic from 'next/dynamic'
import { isDemoMode } from '@/lib/utils/demo'

const GooeyNav = dynamic(() => import('@/components/ui/GooeyNav'), { ssr: false })

export function Navbar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const demoMode = isDemoMode(searchParams)

  const navItems = [
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ]

  const getActiveIndex = () => {
    if (pathname === '/services') return 0
    if (pathname === '/about') return 1
    if (pathname === '/contact') return 2
    return -1
  }

  return (
    <nav className="navbar">
      <Link href={demoMode ? '/?mode=demo' : '/'} className="logo" style={{ color: 'var(--mint-primary)', textShadow: 'var(--mint-glow)', fontSize: '36px', fontWeight: 900, letterSpacing: '0.1em' }}>MINT</Link>
      <div className="nav-links">
        <div className="desktop-nav">
          {!demoMode && (
            <GooeyNav 
              items={navItems} 
              initialActiveIndex={getActiveIndex()} 
              particleCount={10}
            />
          )}
        </div>
        {!demoMode ? (
          <>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </>
        ) : (
          <Link href="/">
             <Button variant="outline" size="sm">Exit Demo</Button>
          </Link>
        )}
      </div>
      <style jsx>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-6) 10%;
          border-bottom: 1px solid var(--bg-tertiary);
          position: sticky;
          top: 0;
          background: rgba(2, 4, 8, 0.8);
          backdrop-filter: blur(8px);
          z-index: 100;
        }
        .logo {
          font-size: 28px;
          font-weight: 800;
          color: var(--mint-primary);
          letter-spacing: 0.15em;
          text-shadow: var(--mint-glow);
          text-decoration: none;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: var(--space-8);
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
        }
        .nav-links a {
          transition: color var(--trans-fast);
        }
        .nav-links a:hover {
          color: var(--text-primary);
        }
        .desktop-nav {
          display: flex;
          align-items: center;
          position: relative;
          margin-top: -4px;
        }
        @media (max-width: 768px) {
          .desktop-nav, .nav-links :global(a:not(:last-child)) {
            display: none;
          }
        }
      `}</style>
    </nav>
  )
}
