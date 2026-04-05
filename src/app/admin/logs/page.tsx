'use client'
import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Search, Download, Terminal, User, FileText, AlertCircle, Activity } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await fetch('/api/admin/logs', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        setLogs(data.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLogs()
  }, [])

  const getActionIcon = (action: string) => {
    if (action.includes('AUTH')) return <Terminal size={14} />
    if (action.includes('REQUEST')) return <FileText size={14} />
    if (action.includes('FILE')) return <AlertCircle size={14} />
    return <Activity size={14} />
  }

  return (
    <div className="admin-logs">
      <header className="page-header">
        <div>
           <h1>Audit Trails</h1>
           <p>Chronological record of all critical system events and security actions.</p>
        </div>
        <Button variant="outline" leftIcon={<Download size={18} />}>Export CSV</Button>
      </header>

      <Card noPadding>
        <div className="logs-container">
           {isLoading ? (
             [1,2,3,4,5,6].map(i => <Skeleton key={i} height={60} className="mb-2" />)
           ) : logs.map(log => (
             <div key={log.id} className="log-row">
                <div className="log-time">{new Date(log.createdAt).toLocaleTimeString()}</div>
                <div className="log-user">
                   <User size={14} />
                   <span>{log.user?.fullName || 'System'}</span>
                </div>
                <div className="log-action">
                   <div className="icon-badge">{getActionIcon(log.action)}</div>
                   <span className="action-text">{log.action.replace(/_/g, ' ')}</span>
                </div>
                <div className="log-details">
                   {log.entityType} <span className="entity-id">#{log.entityId?.substring(0,8)}</span>
                </div>
             </div>
           ))}
        </div>
      </Card>

      <style jsx>{`
        .admin-logs { display: flex; flex-direction: column; gap: var(--space-8); }
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .page-header h1 { font-size: 32px; margin-bottom: var(--space-1); }
        .page-header p { color: var(--text-secondary); }

        .logs-container { display: flex; flex-direction: column; }
        .log-row { display: flex; align-items: center; padding: var(--space-4) var(--space-6); border-bottom: 1px solid var(--bg-tertiary); gap: var(--space-8); transition: background 0.2s; }
        .log-row:hover { background: var(--bg-tertiary); }
        
        .log-time { font-size: 12px; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; min-width: 80px; }
        .log-user { display: flex; align-items: center; gap: 8px; min-width: 140px; font-size: 14px; font-weight: 500; }
        .log-action { display: flex; align-items: center; gap: 12px; flex: 1; }
        .icon-badge { background: var(--bg-tertiary); padding: 6px; border-radius: 6px; display: flex; }
        .action-text { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-primary); }
        .log-details { font-size: 13px; color: var(--text-secondary); min-width: 200px; text-align: right; }
        .entity-id { color: var(--mint-primary); font-family: 'JetBrains Mono', monospace; font-size: 11px; }
      `}</style>
    </div>
  )
}
