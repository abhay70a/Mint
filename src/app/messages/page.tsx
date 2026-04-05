'use client'
import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { MessageSquare, Clock, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function MessagesInboxPage() {
  const [inbox, setInbox] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        // We'll use the requests list and just extract those with messages
        const res = await fetch('/api/requests', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        setInbox(data.data?.filter((r:any) => r._count?.messages > 0) || [])
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchInbox()
  }, [])

  return (
    <div className="inbox-page">
      <header className="page-header">
        <h1>Messages</h1>
        <p>Your communication history across all requests.</p>
      </header>

      <div className="inbox-list">
        {isLoading ? (
          [1,2,3,4].map(i => <Skeleton key={i} height={100} />)
        ) : inbox.length > 0 ? (
          inbox.map(item => (
            <Link key={item.id} href={`/requests/${item.id}`}>
               <Card clickable className="inbox-card">
                  <div className="inbox-icon">
                    <MessageSquare size={24} />
                  </div>
                  <div className="inbox-content">
                    <div className="top">
                      <span className="category">{item.category}</span>
                      <span className="time">{new Date(item.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p className="last-msg">Click to view {item._count?.messages} messages in this thread.</p>
                  </div>
                  <ChevronRight size={20} className="arrow" />
               </Card>
            </Link>
          ))
        ) : (
          <div className="empty">
            <MessageSquare size={48} />
            <p>No messages yet. Start a conversation on any request.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .inbox-page { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-8); }
        .page-header h1 { font-size: 32px; margin-bottom: var(--space-1); }
        .page-header p { color: var(--text-secondary); }

        .inbox-list { display: flex; flex-direction: column; gap: var(--space-4); }
        .inbox-card { display: flex; align-items: center; gap: var(--space-6); padding: var(--space-4) var(--space-6); }
        .inbox-icon { width: 56px; height: 56px; background: var(--bg-tertiary); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--mint-primary); }
        .inbox-content { flex: 1; }
        .top { display: flex; justify-content: space-between; margin-bottom: var(--space-2); }
        .category { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
        .time { font-size: 12px; color: var(--text-muted); }
        .inbox-card h3 { font-size: 18px; margin-bottom: 4px; }
        .last-msg { font-size: 14px; color: var(--text-secondary); }
        .arrow { color: var(--text-muted); }
        
        .empty { padding: var(--space-12); text-align: center; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: var(--space-4); background: var(--bg-secondary); border-radius: 12px; border: 1px dashed var(--bg-tertiary); }
      `}</style>
    </div>
  )
}
