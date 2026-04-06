import React, { useState, useEffect } from 'react'
import { Bell, Search, User, Settings, LogOut, CheckCircle2, Clock, X, MessageSquare, Loader2 } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { isDemoMode, getDemoUrl } from '@/lib/utils/demo'

const GooeyNav = dynamic(() => import('./GooeyNav'), { ssr: false })

export const TopBar: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const demoMode = isDemoMode(searchParams)
  const isAdmin = pathname?.startsWith('/admin')
  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true)
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) return
        const res = await fetch(`/api/requests?search=${encodeURIComponent(searchValue)}&perPage=5`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const json = await res.json()
          setSearchResults(json.data || [])
          setShowSearchResults(true)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchValue])

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Request Completed', message: 'Admin has completed your request "E-commerce Redesign".', time: '10m ago', type: 'success' },
    { id: 2, title: 'In Progress', message: 'Your request "SEO Optimization" is now in progress.', time: '1h ago', type: 'info' },
    { id: 3, title: 'New Message', message: 'Admin sent you a message regarding "Web App".', time: '2h ago', type: 'message' },
    { id: 4, title: 'Request Created', message: 'Your request "Logo Design" was received.', time: '1d ago', type: 'info' },
    { id: 5, title: 'Older Notification', message: 'This should not be visible as it is capped at 4.', time: '3d ago', type: 'info' },
  ])

  const clearNotification = (e: React.MouseEvent, id: number) => {
    e.preventDefault()
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const navItems = [
    { label: 'Requests', href: isAdmin ? '/admin/requests' : '/requests' },
    { label: isAdmin ? 'Users' : 'Messages', href: isAdmin ? '/admin/users' : '/messages' },
  ]
  if (isAdmin) {
    navItems.push({ label: 'Audit Logs', href: '/admin/logs' })
  }
  const getActiveIndex = () => {
    if (pathname === '/dashboard' || pathname === '/admin' || pathname === '/') return -1
    if (pathname?.includes('/requests')) return 0
    if (pathname?.includes(isAdmin ? '/users' : '/messages')) return 1
    if (pathname?.includes('/logs')) return 2
    return -1
  }

  return (
    <header className="topbar">
      <div className="topbar-left">
        <Link href={getDemoUrl(isAdmin ? '/admin' : '/dashboard', demoMode)} className="logo" style={{ color: 'var(--mint-primary)', textShadow: 'var(--mint-glow)', fontSize: '32px', fontWeight: 900, letterSpacing: '0.1em' }}>
          MINT
        </Link>
        {!demoMode && (
          <div style={{ position: 'relative', marginTop: '-4px' }}>
            <GooeyNav 
              items={navItems} 
              initialActiveIndex={getActiveIndex()} 
              particleCount={10}
            />
          </div>
        )}
      </div>

      <div className="topbar-right">
        {!demoMode && (
          <>
            <div className="search-wrapper">
              <div 
                className={`search-container ${searchValue ? 'has-value' : ''}`}
                onClick={() => searchInputRef.current?.focus()}
              >
                <Search size={16} className="search-icon" />
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Search..." 
                  className="search-input"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onFocus={() => { if (searchValue) setShowSearchResults(true) }}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                />
              </div>

              {showSearchResults && (
                <div className="search-dropdown">
                  {isSearching ? (
                    <div className="search-loading"><Loader2 className="spinner" size={16} /> Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <div className="search-results-list">
                      {searchResults.map(req => (
                        <Link key={req.id} href={isAdmin ? `/admin/requests/${req.id}` : `/requests/${req.id}`} className="search-result-item" onClick={() => {setSearchValue(''); setShowSearchResults(false)}}>
                          <div className="search-result-title">{req.title}</div>
                          <div className="search-result-meta">{req.category} &bull; {req.status.replace('_', ' ')}</div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="search-no-results">No requests found</div>
                  )}
                </div>
              )}
            </div>

            <div className="notification-wrapper">
              <button className="notification-btn">
                <Bell size={18} />
                {notifications.length > 0 && <span className="badge" />}
              </button>
              <div className="dropdown notif-dropdown">
                <div className="notif-header">
                  <span>Notifications</span>
                  {notifications.length > 0 && (
                    <button className="clear-all-btn" onClick={() => setNotifications([])}>Clear All</button>
                  )}
                </div>
                <div className="notif-body">
                  {notifications.length === 0 ? (
                    <p className="empty-notif">You're all caught up!</p>
                  ) : (
                    <div className="notif-list">
                      {notifications.slice(0, 4).map(notif => (
                        <div key={notif.id} className="notif-item">
                           <div className="notif-icon">
                             {notif.type === 'success' ? <CheckCircle2 size={16} className="text-success" /> : 
                              notif.type === 'message' ? <MessageSquare size={16} className="text-info" /> :
                              <Clock size={16} className="text-info" />}
                           </div>
                           <div className="notif-content">
                             <div className="notif-title">{notif.title}</div>
                             <div className="notif-desc">{notif.message}</div>
                             <div className="notif-time">{notif.time}</div>
                           </div>
                           <button className="notif-clear" onClick={(e) => clearNotification(e, notif.id)}>
                             <X size={14} />
                           </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        
        <div className="user-profile">
          <div className="avatar">
            <User size={16} />
          </div>
          <div className="dropdown">
            {!demoMode && (
              <Link href={isAdmin ? '/admin/settings' : '/settings'} className="dropdown-item">
                <Settings size={14} />
                <span>Settings</span>
              </Link>
            )}
            {demoMode && (
              <div className="dropdown-item" style={{ pointerEvents: 'none', opacity: 0.7 }}>
                <User size={14} />
                <span>Demo Account</span>
              </div>
            )}
            <div className="dropdown-divider" />
            <button className="dropdown-item text-error" onClick={handleLogout}>
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .topbar {
          height: 64px;
          background: rgba(2, 4, 8, 0.75);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-8);
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: var(--space-8);
          flex: 1;
        }

        .logo {
          font-size: 26px;
          font-weight: 800;
          color: var(--mint-primary);
          letter-spacing: 0.1em;
          text-shadow: var(--mint-glow);
          text-decoration: none;
        }

        .top-nav {
          display: flex;
          align-items: center;
          gap: var(--space-6);
        }

        .nav-link {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all var(--trans-fast);
          padding: var(--space-2) 0;
          border-bottom: 2px solid transparent;
        }

        .nav-link:hover {
          color: var(--text-primary);
        }

        .nav-link.active {
          color: var(--mint-primary);
          border-bottom-color: var(--mint-primary);
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: var(--space-6);
        }

        .search-wrapper {
          position: relative;
        }

        .search-container {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid transparent;
          border-radius: 20px;
          padding: 0;
          width: 36px;
          height: 36px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        
        .search-container:hover {
          background: var(--bg-tertiary);
        }
        
        .search-container:focus-within, 
        .search-container.has-value {
          background: var(--bg-secondary);
          border: 1px solid var(--mint-muted);
          width: 240px;
          justify-content: flex-start;
          padding: 0 12px;
          cursor: text;
          box-shadow: 0 0 0 2px rgba(0, 255, 170, 0.1);
        }

        .search-icon {
          color: var(--text-muted);
          flex-shrink: 0;
          transition: color 0.3s ease;
        }

        .search-container:focus-within .search-icon {
          color: var(--mint-primary);
        }

        .search-input {
          background: none;
          border: none;
          padding: 0;
          color: var(--text-primary);
          width: 0;
          outline: none;
          font-size: 13px;
          opacity: 0;
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .search-container:focus-within .search-input,
        .search-container.has-value .search-input {
          opacity: 1;
          width: 100%;
          padding: 0 var(--space-3);
          pointer-events: auto;
        }

        .search-input::placeholder {
          color: var(--text-muted);
        }

        .search-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 380px;
          background: var(--bg-secondary);
          border: 1px solid var(--bg-tertiary);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          z-index: 100;
        }

        .search-loading, .search-no-results {
          padding: var(--space-4);
          text-align: center;
          color: var(--text-muted);
          font-size: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin { 100% { transform: rotate(360deg); } }

        .search-results-list {
          display: flex;
          flex-direction: column;
        }

        .search-result-item {
          padding: var(--space-3) var(--space-4);
          text-decoration: none;
          border-bottom: 1px solid var(--bg-tertiary);
          display: flex;
          flex-direction: column;
          gap: 2px;
          transition: background var(--trans-fast);
        }

        .search-result-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .search-result-item:last-child {
          border-bottom: none;
        }

        .search-result-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .search-result-meta {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .notification-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          padding-bottom: 12px;
          margin-bottom: -12px;
        }

        .notification-btn {
          position: relative;
          color: var(--text-secondary);
          transition: all var(--trans-fast);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid transparent;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .notification-wrapper:hover .notification-btn {
          color: var(--text-primary);
          background: var(--bg-tertiary);
          border-color: var(--mint-muted);
          box-shadow: 0 0 10px rgba(0, 255, 170, 0.1);
        }

        .badge {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 6px;
          height: 6px;
          background: var(--mint-primary);
          border-radius: 50%;
          box-shadow: var(--mint-glow);
        }

        .dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 4px;
          background: var(--bg-secondary);
          border: 1px solid var(--bg-tertiary);
          border-radius: 12px;
          padding: 6px 0;
          display: flex;
          flex-direction: column;
          min-width: 160px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          z-index: 100;
        }

        .notification-wrapper:hover .dropdown,
        .user-profile:hover .dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .notif-dropdown {
          min-width: 320px;
          padding: 0;
        }

        .notif-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-4);
          font-weight: 600;
          font-size: 14px;
          border-bottom: 1px solid var(--bg-tertiary);
        }

        .clear-all-btn {
          background: none;
          border: none;
          color: var(--mint-primary);
          font-size: 12px;
          cursor: pointer;
        }

        .clear-all-btn:hover {
          text-decoration: underline;
        }

        .notif-body {
          padding: 0;
          max-height: 320px;
          overflow-y: auto;
        }

        .empty-notif {
          padding: var(--space-6) var(--space-4);
          text-align: center;
          color: var(--text-muted);
          font-size: 13px;
          margin: 0;
        }

        .notif-list {
          display: flex;
          flex-direction: column;
        }

        .notif-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--bg-tertiary);
          transition: background var(--trans-fast);
        }

        .notif-item:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .notif-item:last-child {
          border-bottom: none;
        }

        .notif-icon {
          margin-top: 2px;
        }

        .text-success { color: var(--success); }
        .text-info { color: var(--mint-primary); }

        .notif-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .notif-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .notif-desc {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .notif-time {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: var(--space-1);
        }

        .notif-clear {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          opacity: 0;
          transition: all var(--trans-fast);
          padding: 2px;
        }

        .notif-item:hover .notif-clear {
          opacity: 1;
        }

        .notif-clear:hover {
          color: var(--error);
        }

        .user-profile {
          position: relative;
          display: flex;
          align-items: center;
          padding-bottom: 12px;
          margin-bottom: -12px;
        }

        .avatar {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .user-profile:hover .avatar {
          border-color: var(--mint-muted);
          color: var(--mint-primary);
          background: var(--bg-tertiary);
          box-shadow: 0 0 10px rgba(0, 255, 170, 0.1);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          transition: all var(--trans-fast);
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-primary);
        }

        .dropdown-item.text-error:hover {
          color: var(--error);
          background: rgba(255, 77, 77, 0.1);
        }

        .dropdown-divider {
          height: 1px;
          background: var(--bg-tertiary);
          margin: 6px 0;
        }
      `}</style>
    </header>
  )
}
