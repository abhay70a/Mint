'use client'
export const dynamic = 'force-dynamic'
import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { FileText, Clock, CheckCircle, MessageSquare, Plus, Activity } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useSearchParams } from 'next/navigation'
import { isDemoMode, MOCK_DASHBOARD_DATA } from '@/lib/utils/demo'

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const demoMode = isDemoMode(searchParams)
  
  const [isLoading, setIsLoading] = useState(!demoMode)
  const [data, setData] = useState<any>(demoMode ? MOCK_DASHBOARD_DATA : null)

  useEffect(() => {
    if (demoMode) return;
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await fetch('/api/requests', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (isLoading) return <DashboardSkeleton />

  const requests = data?.data || []

  const stats = [
    { label: 'Pending', count: requests.filter((r: any) => r.status === 'PENDING').length, icon: Clock, color: '#f59e0b' },
    { label: 'Active', count: requests.filter((r: any) => r.status === 'IN_PROGRESS').length, icon: Activity, color: '#00ff9d' },
    { label: 'Completed', count: requests.filter((r: any) => r.status === 'COMPLETED').length, icon: CheckCircle, color: '#3b82f6' },
    { label: 'Messages', count: requests.reduce((acc: number, r: any) => acc + (r._count?.messages || 0), 0), icon: MessageSquare, color: '#a8b3cf' },
  ]

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <div>
          <h1>Welcome back</h1>
          <p>Here's what's happening with your projects.</p>
        </div>
        {!demoMode ? (
          <Link href="/requests/new">
            <Button leftIcon={<Plus size={18} />}>New Request</Button>
          </Link>
        ) : (
          <Button leftIcon={<Plus size={18} />} disabled variant="secondary">
            New Request (Demo)
          </Button>
        )}
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <Card key={i} className="stat-card" style={{ '--accent': s.color } as React.CSSProperties}>
            <div className="stat-glow"></div>
            <div className="stat-header">
              <span className="stat-label">{s.label}</span>
            </div>
            <div className="stat-info">
              <span className="stat-value">{s.count}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Requests */}
      <section className="section">
        <div className="section-header">
          <h2>Recent Requests</h2>
          <Link href="/requests" className="view-all">View All</Link>
        </div>

        <div className="request-table-wrapper">
          <table className="request-table">
            <thead>
              <tr>
                <th>Request Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.slice(0, 5).map((req: any) => (
                <tr key={req.id} onClick={() => window.location.href = `/requests/${req.id}`}>
                  <td>
                    <div className="title-cell">
                      <span className="title-text">{req.title}</span>
                      <span className="category-text">{req.category}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`priority-text priority-${req.priority.toLowerCase()}`}>
                      {req.priority}
                    </span>
                  </td>
                  <td><StatusBadge status={req.status} /></td>
                  <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty-state">No requests found. Create one to get started!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <style jsx>{`
        .dashboard-content { display: flex; flex-direction: column; gap: var(--space-8); }
        .dashboard-header { display: flex; justify-content: space-between; align-items: flex-end; }
        
        .demo-banner {
          background: rgba(0, 255, 157, 0.1);
          border: 1px solid rgba(0, 255, 157, 0.2);
          color: var(--mint-primary);
          padding: 12px 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
        }
        .dashboard-header h1 { font-size: 32px; margin-bottom: var(--space-1); }
        .dashboard-header p { color: var(--text-secondary); }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: var(--space-6);
        }
        .stat-card {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
          padding: var(--space-6);
          border: 1px solid var(--bg-tertiary);
          background: rgba(20, 22, 26, 0.4);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        .stat-card:hover {
          transform: translateY(-3px);
          border-color: color-mix(in srgb, var(--accent) 30%, transparent);
          box-shadow: 0 12px 32px color-mix(in srgb, var(--accent) 10%, transparent);
        }
        .stat-header {
           display: flex;
           justify-content: space-between;
           align-items: center;
           z-index: 2;
        }
        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .stat-info { z-index: 2; }
        .stat-value {
           font-size: 38px;
           font-weight: 800;
           color: var(--text-primary);
           line-height: 1;
           letter-spacing: -0.03em;
        }
        .stat-glow {
           position: absolute;
           top: 0;
           right: 0;
           width: 150px;
           height: 150px;
           background: radial-gradient(circle at top right, color-mix(in srgb, var(--accent) 15%, transparent), transparent 70%);
           border-radius: 50%;
           z-index: 1;
           pointer-events: none;
        }

        .section { display: flex; flex-direction: column; gap: var(--space-6); }
        .section-header { display: flex; justify-content: space-between; align-items: center; }
        .view-all { color: var(--mint-primary); font-size: 14px; font-weight: 500; }

        .request-table-wrapper {
          background: var(--bg-secondary);
          border: 1px solid var(--bg-tertiary);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        .request-table { width: 100%; border-collapse: collapse; text-align: left; }
        .request-table th {
          padding: var(--space-4) var(--space-6);
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--bg-tertiary);
        }
        .request-table td {
          padding: var(--space-4) var(--space-6);
          border-bottom: 1px solid var(--bg-tertiary);
          font-size: 14px;
          cursor: pointer;
          transition: background var(--trans-fast);
        }
        .request-table tr:hover td { background: var(--bg-tertiary); }
        .title-cell { display: flex; flex-direction: column; }
        .category-text { font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; }
        
        .priority-text { font-weight: 600; font-size: 12px; }
        .priority-high { color: var(--error); }
        .priority-medium { color: var(--warning); }
        .priority-low { color: var(--info); }
        
        .empty-state { padding: var(--space-12) !important; text-align: center; color: var(--text-muted); }
      `}</style>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <div style={{ width: '300px' }}>
          <Skeleton height={32} width="60%" className="mb-2" />
          <Skeleton height={20} width="90%" />
        </div>
        <Skeleton height={40} width={140} />
      </div>
      <div className="stats-grid">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} height={80} />)}
      </div>
      <div className="section">
        <Skeleton height={30} width={200} />
        <Skeleton height={300} />
      </div>
    </div>
  )
}
