'use client'
import React, { useEffect, useState } from 'react'

import { JWTPayload, verifyAccessToken } from '@/lib/auth/jwt'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<JWTPayload | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setUser(payload)
    } catch (err) {
      router.push('/login')
    }
  }, [router])

  if (!user) return null

  return (
    <div className="dashboard-layout">
      <main className="main-content">

        <div className="page-container">
          {children}
        </div>
      </main>

      <style jsx>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background: var(--bg-main);
        }
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .page-container {
          padding: var(--space-8);
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
        }
      `}</style>
    </div>
  )
}
