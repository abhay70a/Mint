'use client'
import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Users, FileText, CheckCircle, Activity, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        setStats(data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (isLoading) return <SkeletonGrid />

  const kpis = [
    { label: 'Total Clients', value: stats.users.total, icon: Users, color: 'var(--mint-primary)' },
    { label: 'Open Requests', value: stats.requests.open, icon: FileText, color: 'var(--info)' },
    { label: 'Completed', value: stats.requests.completed, icon: CheckCircle, color: 'var(--success)' },
    { label: 'Weekly Velocity', value: stats.requests.weeklyCount, icon: Activity, color: 'var(--warning)' },
  ]

  return (
    <div className="admin-overview">
      <header className="page-header">
        <h1>Platform Overview</h1>
        <p>Monitor system performance and service demand.</p>
      </header>

      <div className="kpi-grid">
        {kpis.map((k, i) => (
          <Card key={i} className="kpi-card">
            <div className="kpi-content">
              <span className="label">{k.label}</span>
              <span className="value">{k.value}</span>
            </div>
            <div className="kpi-icon" style={{ background: k.color + '1a', color: k.color }}>
               <k.icon size={24} />
            </div>
          </Card>
        ))}
      </div>

      <div className="admin-main-grid">
         <Card className="full-request-queue">
            <div className="card-header">
              <h3>Incoming Service Queue</h3>
              <Link href="/admin/requests" className="link">Queue Explorer <ArrowUpRight size={14} /></Link>
            </div>
            <div className="placeholder-text">Request queue summary will appear here.</div>
         </Card>

         <Card className="system-activity">
            <div className="card-header">
              <h3>System Activity</h3>
              <Link href="/admin/logs" className="link">View Logs</Link>
            </div>
            <div className="placeholder-text">Recent audit logs will appear here.</div>
         </Card>
      </div>

      <style jsx>{`
        .admin-overview { display: flex; flex-direction: column; gap: var(--space-8); }
        .page-header h1 { font-size: 32px; margin-bottom: var(--space-1); }
        .page-header p { color: var(--text-secondary); }

        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--space-6); }
        .kpi-card { display: flex; justify-content: space-between; align-items: center; }
        .label { font-size: 13px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
        .value { font-size: 32px; font-weight: 700; color: var(--text-primary); margin-top: 4px; display: block; }
        .kpi-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }

        .admin-main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-6); min-height: 400px; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6); }
        .card-header h3 { font-size: 16px; }
        .link { color: var(--mint-primary); font-size: 13px; display: flex; align-items: center; gap: 4px; }
        .placeholder-text { color: var(--text-muted); font-size: 14px; text-align: center; padding: var(--space-12) 0; }

        @media (max-width: 1024px) { .admin-main-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div className="admin-overview">
       <Skeleton height={60} width={400} />
       <div className="kpi-grid">
         {[1,2,3,4].map(i => <Skeleton key={i} height={100} />)}
       </div>
       <div className="admin-main-grid">
          <Skeleton height={400} />
          <Skeleton height={400} />
       </div>
    </div>
  )
}
