'use client'
import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Skeleton } from '@/components/ui/Skeleton'
import { Search, Filter, Plus, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function RequestListPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
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

  const filtered = requests.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="request-list-page">
      <header className="page-header">
        <div>
          <h1>Service Requests</h1>
          <p>Manage and track all your active projects.</p>
        </div>
        <Link href="/requests/new">
          <Button variant="primary" leftIcon={<Plus size={18} />}>New Request</Button>
        </Link>
      </header>

      <div className="controls">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by title or category..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="status-select">
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid">
        {isLoading ? (
          [1,2,3,4,5,6].map(i => <Skeleton key={i} height={100} variant="rect" />)
        ) : filtered.length > 0 ? (
          filtered.map(req => (
            <Link key={req.id} href={`/requests/${req.id}`}>
              <Card clickable className="request-card">
                <div className="request-info">
                  <div className="title-row">
                    <span className="category">{req.category}</span>
                    <StatusBadge status={req.status} />
                  </div>
                  <h3>{req.title}</h3>
                  <p className="description">{req.description.substring(0, 120)}...</p>
                </div>
                
                <div className="request-footer">
                  <div className="meta">
                    <span className={`priority p-${req.priority.toLowerCase()}`}>{req.priority}</span>
                    <span className="date">{new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>
                  <ChevronRight size={18} className="arrow" />
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <div className="empty">No requests found matching your filters.</div>
        )}
      </div>

      <style jsx>{`
        .request-list-page { display: flex; flex-direction: column; gap: var(--space-8); }
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .page-header h1 { font-size: 32px; margin-bottom: var(--space-1); }
        .page-header p { color: var(--text-secondary); }

        .controls { display: flex; gap: var(--space-4); }
        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          background: var(--bg-secondary);
          border: 1px solid var(--bg-tertiary);
          border-radius: var(--radius-md);
          padding: 0 var(--space-4);
        }
        .search-box input {
          background: none; border: none; padding: var(--space-3) var(--space-3);
          color: var(--text-primary); outline: none; flex: 1; font-size: 14px;
        }
        .search-icon { color: var(--text-muted); }
        
        .status-select {
          background: var(--bg-secondary);
          border: 1px solid var(--bg-tertiary);
          color: var(--text-primary);
          padding: var(--space-3) var(--space-6);
          border-radius: var(--radius-md);
          outline: none;
          cursor: pointer;
          font-weight: 500;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: var(--space-6);
        }
        .request-card { display: flex; flex-direction: column; height: 100%; justify-content: space-between; }
        .title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2); }
        .category { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.1em; }
        .request-card h3 { font-size: 18px; margin-bottom: var(--space-3); line-height: 1.4; color: var(--text-primary); }
        .description { font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin-bottom: var(--space-6); }
        
        .request-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--space-4);
          border-top: 1px solid var(--bg-tertiary);
        }
        .meta { display: flex; align-items: center; gap: var(--space-4); }
        .priority { font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .p-high { color: var(--error); }
        .p-medium { color: var(--warning); }
        .p-low { color: var(--info); }
        .date { font-size: 12px; color: var(--text-muted); }
        .arrow { color: var(--text-muted); opacity: 0; transition: all var(--trans-fast); transform: translateX(-10px); }
        
        :global(.request-card:hover) .arrow { opacity: 1; transform: translateX(0); }
        .empty { grid-column: 1/-1; padding: var(--space-12); text-align: center; color: var(--text-muted); background: var(--bg-secondary); border-radius: 12px; border: 1px dashed var(--bg-tertiary); }
      `}</style>
    </div>
  )
}
