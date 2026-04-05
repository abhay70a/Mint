'use client'
import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Search, Filter, MessageCircle, ExternalLink, User } from 'lucide-react'
import Link from 'next/link'

export default function AdminRequestQueuePage() {
  const [requests, setRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await fetch('/api/requests', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        setRequests(data.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRequests()
  }, [])

  const filtered = requests.filter(r => statusFilter === 'ALL' || r.status === statusFilter)

  return (
    <div className="admin-queue">
      <header className="page-header">
        <h1>Request Queue</h1>
        <p>Manage and assign service requests across the platform.</p>
      </header>

      <div className="controls">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="filter-select">
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <Card noPadding>
        <div className="table-wrapper">
          <table className="queue-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Request Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Messages</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1,2,3,4,5].map(i => <tr key={i}><td colSpan={6}><div className="skeleton" style={{ height: '40px' }} /></td></tr>)
              ) : filtered.map(req => (
                <tr key={req.id} onClick={() => window.location.href = `/admin/requests/${req.id}`}>
                  <td>
                    <div className="client-cell">
                      <User size={14} />
                      <span>{req.client.fullName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="title-cell">
                      <span className="title">{req.title}</span>
                      <span className="subtitle">{req.category}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`priority-tag p-${req.priority.toLowerCase()}`}>{req.priority}</span>
                  </td>
                  <td><StatusBadge status={req.status} /></td>
                  <td>
                    <div className="msg-count">
                      <MessageCircle size={14} />
                      {req._count?.messages || 0}
                    </div>
                  </td>
                  <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <style jsx>{`
        .admin-queue { display: flex; flex-direction: column; gap: var(--space-8); }
        .page-header h1 { font-size: 32px; margin-bottom: var(--space-1); }
        .page-header p { color: var(--text-secondary); }

        .filter-select { background: var(--bg-secondary); border: 1px solid var(--bg-tertiary); color: var(--text-primary); padding: var(--space-3) var(--space-6); border-radius: var(--radius-md); outline: none; }
        
        .table-wrapper { overflow-x: auto; }
        .queue-table { width: 100%; border-collapse: collapse; text-align: left; }
        .queue-table th { padding: var(--space-4) var(--space-6); font-size: 11px; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--bg-tertiary); }
        .queue-table td { padding: var(--space-4) var(--space-6); border-bottom: 1px solid var(--bg-tertiary); font-size: 14px; cursor: pointer; transition: background 0.2s; }
        .queue-table tr:hover td { background: var(--bg-tertiary); }

        .client-cell { display: flex; align-items: center; gap: 8px; font-weight: 500; font-size: 13px; }
        .title-cell { display: flex; flex-direction: column; }
        .title { font-weight: 600; color: var(--text-primary); }
        .subtitle { font-size: 11px; color: var(--text-muted); font-weight: 700; text-transform: uppercase; }

        .priority-tag { font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; border: 1px solid transparent; }
        .p-high { color: var(--error); border-color: rgba(255, 77, 77, 0.2); }
        .p-medium { color: var(--warning); border-color: rgba(255, 171, 112, 0.2); }
        .p-low { color: var(--info); border-color: rgba(77, 171, 255, 0.2); }

        .msg-count { display: flex; align-items: center; gap: 4px; color: var(--text-muted); font-size: 13px; }
      `}</style>
    </div>
  )
}
