'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { FileText, Send, Download, Clock, Info, ArrowLeft, User, CheckCircle2 } from 'lucide-react'

const STATUS_OPTIONS = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED']

export default function AdminRequestDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { addToast } = useToast()
  const [data, setData] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const msgEndRef = useRef<HTMLDivElement>(null)

  const addToastRef = useRef(addToast)
  useEffect(() => { addToastRef.current = addToast }, [addToast])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const [reqRes, msgRes] = await Promise.all([
        fetch(`/api/requests/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/api/requests/${id}/messages`, { headers: { 'Authorization': `Bearer ${token}` } })
      ])

      if (!reqRes.ok) {
        const err = await reqRes.json()
        throw new Error(err.error?.message || 'Failed to load request')
      }

      const reqJson = await reqRes.json()
      const msgJson = msgRes.ok ? await msgRes.json() : { data: [] }

      setData(reqJson.data)
      setMessages(msgJson.data || [])
    } catch (err: any) {
      addToastRef.current(err.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [id])
  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    setIsSending(true)
    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`/api/requests/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ body: newMessage })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error?.message || 'Failed to send')
      setMessages(prev => [...prev, json.data])
      setNewMessage('')
    } catch (err: any) {
      addToast(err.message, 'error')
    } finally {
      setIsSending(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdatingStatus(true)
    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error?.message || 'Failed to update status')
      setData((prev: any) => ({ ...prev, status: newStatus }))
      addToast(`Status updated to ${newStatus.replace('_', ' ')}`, 'success')
    } catch (err: any) {
      addToast(err.message, 'error')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  if (isLoading) return (
    <div className="admin-detail-page">
      <Skeleton height={40} />
      <div className="detail-grid">
        <div className="left-col"><Skeleton height={200} /><Skeleton height={150} /></div>
        <div className="right-col"><Skeleton height="100%" /></div>
      </div>
    </div>
  )

  if (!data) return (
    <div className="error-container">
      <Card>
        <h2>Request Not Found</h2>
        <p>This request does not exist or could not be loaded.</p>
        <Button onClick={() => router.push('/admin/requests')} leftIcon={<ArrowLeft size={16} />}>Back to Queue</Button>
      </Card>
    </div>
  )

  return (
    <div className="admin-detail-page">
      <header className="page-header">
        <button className="back-btn" onClick={() => router.push('/admin/requests')}>
          <ArrowLeft size={16} /> Back to Queue
        </button>
        <div className="header-actions">
          <span className="client-tag"><User size={14} /> {data.client?.fullName}</span>
          <StatusBadge status={data.status} />
          {data.status !== 'REJECTED' && (
             <button 
               className="deny-btn" 
               onClick={() => handleStatusChange('REJECTED')}
               disabled={isUpdatingStatus}
             >
               Deny
             </button>
          )}
          <div className="status-changer">
            <select
              value={data.status}
              onChange={e => handleStatusChange(e.target.value)}
              disabled={isUpdatingStatus}
              className="status-select"
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <div className="detail-grid">
        {/* Left Column */}
        <div className="left-col">
          <Card className="info-card">
            <header className="info-header">
              <span className="category">{data.category}</span>
            </header>
            <h1>{data.title}</h1>
            <div className="description" dangerouslySetInnerHTML={{ __html: data.description }} />
            <div className="meta-row">
              <div className="meta-item"><Clock size={14} /><span>Created {new Date(data.createdAt).toLocaleDateString()}</span></div>
              <div className="meta-item"><Info size={14} /><span>Priority: {data.priority}</span></div>
            </div>
          </Card>

          <Card className="files-card">
            <div className="section-header">
              <h2>Attachments</h2>
              <span className="count">{data.files?.length || 0}</span>
            </div>
            <div className="file-list">
              {data.files?.map((file: any) => (
                <div key={file.id} className="file-item">
                  <div className="file-icon"><FileText size={18} /></div>
                  <div className="file-info">
                    <span className="name">{file.fileName}</span>
                    <span className="size">{(file.sizeBytes / 1024).toFixed(1)} KB</span>
                  </div>
                  <a href={`/api/files/${file.id}`} download className="file-action"><Download size={16} /></a>
                </div>
              ))}
              {(!data.files || data.files.length === 0) && <p className="empty">No attachments.</p>}
            </div>
          </Card>

          {data.statusLogs?.length > 0 && (
            <Card className="files-card">
              <div className="section-header"><h2>Status History</h2></div>
              <div className="log-list">
                {data.statusLogs.map((log: any) => (
                  <div key={log.id} className="log-item">
                    <CheckCircle2 size={14} />
                    <span>{log.fromStatus} → {log.toStatus}</span>
                    <span className="log-date">{new Date(log.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Chat */}
        <div className="right-col">
          <Card className="chat-card" noPadding>
            <div className="chat-header">
              <h2>Communication</h2>
              <span className="chat-sub">with {data.client?.fullName}</span>
            </div>
            <div className="chat-messages">
              {messages.length === 0 && (
                <div className="no-messages">No messages yet. Start the conversation.</div>
              )}
              {messages.map((msg: any) => (
                <div key={msg.id} className={`message ${msg.sender?.role === 'ADMIN' ? 'admin' : 'client'}`}>
                  <div className="message-header">
                    <span className="sender">{msg.sender?.fullName}</span>
                    <span className="time">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="message-body">{msg.body}</div>
                </div>
              ))}
              <div ref={msgEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="chat-input-area">
              <input
                type="text"
                placeholder="Reply to client..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
              />
              <div className="actions">
                <Button size="sm" type="submit" isLoading={isSending} rightIcon={<Send size={14} />}>Send</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      <style jsx>{`
        .admin-detail-page { display: flex; flex-direction: column; gap: var(--space-6); height: calc(100vh - 128px); }
        .error-container { display: flex; align-items: center; justify-content: center; min-height: 400px; text-align: center; }
        .error-container :global(.card) { max-width: 400px; display: flex; flex-direction: column; gap: var(--space-4); align-items: center; }

        .page-header { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); flex-wrap: wrap; }
        .back-btn { display: flex; align-items: center; gap: var(--space-2); color: var(--text-muted); font-size: 14px; font-weight: 500; background: none; border: none; cursor: pointer; transition: color var(--trans-fast); padding: 0; }
        .back-btn:hover { color: var(--text-primary); }
        .header-actions { display: flex; align-items: center; gap: var(--space-4); }
        .client-tag { display: flex; align-items: center; gap: var(--space-2); font-size: 13px; font-weight: 600; color: var(--text-secondary); background: var(--bg-tertiary); padding: 4px 10px; border-radius: 20px; }
        .status-select { background: var(--bg-secondary); border: 1px solid var(--mint-muted); color: var(--mint-primary); padding: var(--space-2) var(--space-4); border-radius: var(--radius-md); outline: none; font-size: 13px; font-weight: 600; cursor: pointer; }
        .deny-btn { background: rgba(255, 77, 77, 0.1); color: var(--error); border: 1px solid rgba(255, 77, 77, 0.2); padding: 5px 12px; border-radius: var(--radius-md); font-size: 13px; font-weight: 600; cursor: pointer; transition: background var(--trans-fast); }
        .deny-btn:hover { background: rgba(255, 77, 77, 0.2); }
        .deny-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .detail-grid { display: grid; grid-template-columns: 1fr 400px; gap: var(--space-6); flex: 1; min-height: 0; }
        .left-col { display: flex; flex-direction: column; gap: var(--space-6); overflow-y: auto; }
        .info-card h1 { font-size: 26px; margin: var(--space-4) 0; }
        .info-header { margin-bottom: var(--space-2); }
        .category { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
        .description { font-size: 15px; line-height: 1.6; color: var(--text-secondary); margin-bottom: var(--space-6); }
        .meta-row { display: flex; gap: var(--space-6); border-top: 1px solid var(--bg-tertiary); padding-top: var(--space-4); }
        .meta-item { display: flex; align-items: center; gap: var(--space-2); font-size: 13px; color: var(--text-muted); }

        .section-header { display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-4); }
        .section-header h2 { font-size: 16px; font-weight: 600; }
        .count { background: var(--bg-tertiary); padding: 2px 6px; border-radius: 4px; font-size: 11px; color: var(--text-secondary); }
        .file-item { display: flex; align-items: center; gap: var(--space-4); background: var(--bg-main); padding: var(--space-3) var(--space-4); border-radius: 8px; border: 1px solid var(--bg-tertiary); margin-bottom: var(--space-2); }
        .file-info { flex: 1; display: flex; flex-direction: column; }
        .file-info .name { font-size: 14px; font-weight: 500; }
        .file-info .size { font-size: 11px; color: var(--text-muted); }
        .file-action { color: var(--text-muted); transition: color var(--trans-fast); }
        .file-action:hover { color: var(--mint-primary); }
        .empty { font-size: 14px; color: var(--text-muted); }

        .log-list { display: flex; flex-direction: column; gap: var(--space-2); }
        .log-item { display: flex; align-items: center; gap: var(--space-3); font-size: 13px; color: var(--text-secondary); }
        .log-date { margin-left: auto; font-size: 11px; color: var(--text-muted); }

        .right-col { display: flex; height: 100%; }
        .chat-card { display: flex; flex-direction: column; width: 100%; }
        .chat-header { padding: var(--space-4) var(--space-6); border-bottom: 1px solid var(--bg-tertiary); }
        .chat-header h2 { font-size: 16px; font-weight: 600; }
        .chat-sub { font-size: 12px; color: var(--text-muted); }
        .chat-messages { flex: 1; overflow-y: auto; padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4); }
        .no-messages { text-align: center; color: var(--text-muted); font-size: 13px; padding: var(--space-8) 0; }

        .message { max-width: 85%; padding: var(--space-3) var(--space-4); border-radius: 12px; }
        .message.client { align-self: flex-start; background: var(--bg-tertiary); border: 1px solid var(--bg-elevated); }
        .message.admin { align-self: flex-end; background: var(--bg-elevated); border: 1px solid var(--mint-muted); }
        .message-header { display: flex; justify-content: space-between; gap: var(--space-4); margin-bottom: 4px; }
        .sender { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
        .time { font-size: 10px; color: var(--text-muted); }
        .message-body { font-size: 14px; line-height: 1.5; }

        .chat-input-area { padding: var(--space-4); border-top: 1px solid var(--bg-tertiary); display: flex; flex-direction: column; gap: var(--space-3); }
        .chat-input-area input { background: var(--bg-main); border: 1px solid var(--bg-tertiary); border-radius: 8px; padding: var(--space-3) var(--space-4); color: var(--text-primary); outline: none; }
        .chat-input-area .actions { display: flex; justify-content: flex-end; }

        @media (max-width: 1280px) {
          .detail-grid { grid-template-columns: 1fr; height: auto; }
          .admin-detail-page { height: auto; }
          .right-col { height: 500px; }
        }
      `}</style>
    </div>
  )
}
