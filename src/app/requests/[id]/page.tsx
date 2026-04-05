'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'
import { FileText, Send, Paperclip, Download, Trash2, Clock, Info, CheckCircle2 } from 'lucide-react'

export default function RequestDetailPage() {
  const { id } = useParams()
  const { addToast } = useToast()
  const [data, setData] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const msgEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addToastRef = useRef(addToast)
  useEffect(() => { addToastRef.current = addToast }, [addToast])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setNewMessage(prev => prev ? `${prev} [Attachment: ${file.name}]` : `[Attachment: ${file.name}]`)
      addToast(`Attached ${file.name}`, 'success')
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }
  useEffect(() => { addToastRef.current = addToast }, [addToast])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const [reqRes, msgRes] = await Promise.all([
          fetch(`/api/requests/${id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`/api/requests/${id}/messages`, { headers: { 'Authorization': `Bearer ${token}` } })
        ])

        if (!reqRes.ok) {
          const err = await reqRes.json()
          throw new Error(err.error?.message || 'Failed to fetch request details')
        }
        
        const reqJson = await reqRes.json()
        const msgJson = msgRes.ok ? await msgRes.json() : { data: [] }
        
        setData(reqJson.data)
        setMessages(msgJson.data || [])
      } catch (err: any) {
        console.error(err)
        addToastRef.current(err.message, 'error')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this request? This action cannot be undone.')) return
    setIsDeleting(true)
    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`/api/requests/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error?.message || 'Failed to delete')
      }
      addToast('Request deleted successfully', 'success')
      window.location.href = '/requests'
    } catch (err: any) {
      addToast(err.message, 'error')
      setIsDeleting(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`/api/requests/${id}/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ body: newMessage })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error?.message || 'Failed to send')

      setMessages([...messages, json.data])
      setNewMessage('')
    } catch (err: any) {
      addToast(err.message, 'error')
    }
  }

  if (isLoading) return <RequestSkeleton />
  if (!data) return (
    <div className="error-container">
       <Card>
         <h2>Request Not Found</h2>
         <p>The service request you are looking for does not exist or you do not have permission to view it.</p>
         <Button onClick={() => window.location.href = '/requests'}>Back to Requests</Button>
       </Card>
       <style jsx>{`
         .error-container { display: flex; align-items: center; justify-content: center; min-height: 400px; text-align: center; }
         .error-container :global(.card) { max-width: 400px; display: flex; flex-direction: column; gap: var(--space-4); align-items: center; }
       `}</style>
    </div>
  )

  return (
    <div className="detail-page">
      <div className="detail-grid">
        
        {/* Left Column: Info + Files */}
        <div className="left-col">
          <Card className="info-card">
            <header className="info-header">
              <div className="header-badges">
                <span className="category">{data.category}</span>
                <StatusBadge status={data.status} />
              </div>
              <button 
                onClick={handleDelete} 
                className="delete-btn" 
                disabled={isDeleting}
                title="Delete Request"
              ><Trash2 size={16} /> Delete</button>
            </header>
            <h1>{data.title}</h1>
            <div className="description" dangerouslySetInnerHTML={{ __html: data.description }} />
            
            <div className="meta-row">
              <div className="meta-item">
                <Clock size={14} />
                <span>Created {new Date(data.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="meta-item">
                <Info size={14} />
                <span>Priority: {data.priority}</span>
              </div>
            </div>
          </Card>

          <Card title="Attachments" className="files-card">
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
              {(!data.files || data.files.length === 0) && <p className="empty">No attachments yet.</p>}
            </div>
          </Card>

          {data.statusLogs?.length > 0 && (
            <Card className="files-card">
              <div className="section-header"><h2>Progress History</h2></div>
              <div className="log-list">
                {data.statusLogs.map((log: any) => (
                  <div key={log.id} className="log-item">
                    <CheckCircle2 size={14} className="log-icon" />
                    <span>{log.fromStatus?.replace('_', ' ') || 'CREATED'} &rarr; {log.toStatus.replace('_', ' ')}</span>
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
            </div>
            
            <div className="chat-messages">
                {messages.length === 0 && (
                  <div className="waiting-state">
                    <div className="waiting-icon">✅</div>
                    <p className="waiting-title">Request Sent!</p>
                    <p className="waiting-sub">Your request has been submitted. We'll review it and get back to you here.</p>
                  </div>
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
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileSelect} />
              <input 
                type="text" 
                placeholder="Type your message..." 
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
              />
              <div className="actions">
                <button type="button" className="action-btn" onClick={() => fileInputRef.current?.click()}>
                   <Paperclip size={18} />
                </button>
                <Button size="sm" type="submit" rightIcon={<Send size={14} />}>Send</Button>
              </div>
            </form>
          </Card>
        </div>

      </div>

      <style jsx>{`
        .detail-page { height: calc(100vh - 128px); }
        .detail-grid { 
          display: grid; 
          grid-template-columns: 1fr 400px; 
          gap: var(--space-6);
          height: 100%;
        }
        
        .left-col { display: flex; flex-direction: column; gap: var(--space-6); overflow-y: auto; }
        .info-card h1 { font-size: 28px; margin: var(--space-4) 0; }
        .info-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-2); }
        .header-badges { display: flex; alignItems: center; gap: 8px; }
        .category { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-top: 4px; }
        .delete-btn { display: flex; align-items: center; gap: 6px; background: rgba(255, 77, 77, 0.1); color: var(--error); border: 1px solid rgba(255, 77, 77, 0.2); border-radius: 6px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all var(--trans-fast); }
        .delete-btn:hover { background: rgba(255, 77, 77, 0.2); }
        .delete-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .description { font-size: 15px; line-height: 1.6; color: var(--text-secondary); margin-bottom: var(--space-8); }
        .meta-row { display: flex; gap: var(--space-6); border-top: 1px solid var(--bg-tertiary); padding-top: var(--space-4); }
        .meta-item { display: flex; align-items: center; gap: var(--space-2); font-size: 13px; color: var(--text-muted); }

        .files-card { padding: var(--space-6); }
        .section-header { display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-4); }
        .section-header h2 { font-size: 16px; font-weight: 600; }
        .count { background: var(--bg-tertiary); padding: 2px 6px; border-radius: 4px; font-size: 11px; color: var(--text-secondary); }
        .file-item { display: flex; align-items: center; gap: var(--space-4); background: var(--bg-main); padding: var(--space-3) var(--space-4); border-radius: 8px; border: 1px solid var(--bg-tertiary); margin-bottom: var(--space-2); }
        .file-info { flex: 1; display: flex; flex-direction: column; }
        .file-info .name { font-size: 14px; font-weight: 500; }
        .file-info .size { font-size: 11px; color: var(--text-muted); }
        .file-action { color: var(--text-muted); transition: color var(--trans-fast); }
        .file-action:hover { color: var(--mint-primary); }

        .log-list { display: flex; flex-direction: column; gap: var(--space-4); }
        .log-item { display: flex; align-items: center; gap: var(--space-3); font-size: 13px; color: var(--text-secondary); background: var(--bg-main); padding: var(--space-3) var(--space-4); border-radius: 8px; border: 1px solid var(--bg-tertiary); }
        .log-icon { color: var(--mint-primary); }
        .log-date { margin-left: auto; font-size: 11px; color: var(--text-muted); font-weight: 500; }

        .right-col { display: flex; height: 100%; }
        .chat-card { display: flex; flex-direction: column; width: 100%; }
        .chat-header { padding: var(--space-4) var(--space-6); border-bottom: 1px solid var(--bg-tertiary); }
        .chat-header h2 { font-size: 16px; }
        .chat-messages { flex: 1; overflow-y: auto; padding: var(--space-6); display: flex; flex-direction: column; gap: var(--space-4); }
        
        .waiting-state { display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; text-align: center; padding: var(--space-8); gap: var(--space-3); }
        .waiting-icon { font-size: 40px; }
        .waiting-title { font-size: 18px; font-weight: 700; color: var(--mint-primary); margin: 0; }
        .waiting-sub { font-size: 14px; color: var(--text-muted); line-height: 1.5; margin: 0; max-width: 280px; }
        
        .message { max-width: 85%; padding: var(--space-3) var(--space-4); border-radius: 12px; }
        .message.client { align-self: flex-start; background: var(--bg-tertiary); border: 1px solid var(--bg-elevated); }
        .message.admin { align-self: flex-end; background: var(--bg-elevated); border: 1px solid var(--mint-muted); }
        .message-header { display: flex; justify-content: space-between; gap: var(--space-4); margin-bottom: 4px; }
        .sender { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
        .time { font-size: 10px; color: var(--text-muted); }
        .message-body { font-size: 14px; line-height: 1.5; }

        .chat-input-area { padding: var(--space-4); border-top: 1px solid var(--bg-tertiary); display: flex; flex-direction: column; gap: var(--space-3); }
        .chat-input-area input { background: var(--bg-main); border: 1px solid var(--bg-tertiary); border-radius: 8px; padding: var(--space-3) var(--space-4); color: var(--text-primary); outline: none; }
        .chat-input-area .actions { display: flex; justify-content: space-between; align-items: center; }
        .action-btn { color: var(--text-muted); padding: 4px; border-radius: 4px; transition: background var(--trans-fast); }
        .action-btn:hover { background: var(--bg-tertiary); color: var(--text-primary); }

        @media (max-width: 1280px) {
          .detail-grid { grid-template-columns: 1fr; height: auto; }
          .detail-page { height: auto; }
          .right-col { height: 600px; }
        }
      `}</style>
    </div>
  )
}

function RequestSkeleton() {
  return (
    <div className="detail-grid">
       <div className="left-col">
          <Skeleton height={200} />
          <Skeleton height={150} />
       </div>
       <div className="right-col">
          <Skeleton height="100%" />
       </div>
    </div>
  )
}
