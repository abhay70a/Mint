'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, MessageSquare, Settings, Shield, Menu } from 'lucide-react'

interface SidebarProps {
  role: 'CLIENT' | 'ADMIN'
}

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const pathname = usePathname()
  
  const clientLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/requests', label: 'Requests', icon: FileText },
    { href: '/messages', label: 'Messages', icon: MessageSquare },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  const adminLinks = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/requests', label: 'Request Queue', icon: FileText },
    { href: '/admin/users', label: 'Users', icon: Shield },
    { href: '/admin/logs', label: 'Audit Logs', icon: FileText },
    { href: '/admin/settings', label: 'Platform', icon: Settings },
  ]

  const links = role === 'ADMIN' ? adminLinks : clientLinks

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <div className="logo">MINT</div>
      </div>

      <nav className="nav">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          
          return (
            <Link key={link.href} href={link.href} className={`nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>

      <style jsx>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          background: var(--bg-main);
          border-right: 1px solid var(--bg-tertiary);
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
        }
        .logo-section {
          padding: var(--space-8) var(--space-6);
        }
        .logo {
          font-size: 20px;
          font-weight: 800;
          color: var(--mint-primary);
          letter-spacing: 0.1em;
          text-shadow: var(--mint-glow);
        }
        .nav {
          flex: 1;
          padding: 0 var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 500;
          transition: all var(--trans-fast);
        }
        .nav-link:hover {
          color: var(--text-primary);
          background: var(--bg-secondary);
        }
        .nav-link.active {
          color: var(--mint-primary);
          background: var(--bg-tertiary);
          position: relative;
        }
        .nav-link.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 25%;
          height: 50%;
          width: 3px;
          background: var(--mint-primary);
          border-radius: 0 4px 4px 0;
        }
      `}</style>
    </aside>
  )
}
