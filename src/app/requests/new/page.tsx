'use client'
import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FileUpload } from '@/components/ui/FileUpload'
import { RichTextEditor } from '@/components/ui/RichTextEditor'
import { useToast } from '@/components/ui/Toast'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'

export default function NewRequestPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [submittedId, setSubmittedId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'WEBSITE',
    priority: 'MEDIUM',
    description: '',
    files: [] as File[]
  })

  const nextStep = () => setStep(s => s + 1)
  const prevStep = () => setStep(s => s - 1)

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      
      // 1. Create Request
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          priority: formData.priority,
          description: formData.description
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || 'Failed to create request')

      const requestId = data.data.id

      // 2. Upload Files
      if (formData.files.length > 0) {
        for (const file of formData.files) {
          const body = new FormData()
          body.append('file', file)
          body.append('requestId', requestId)
          
          await fetch('/api/files', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body
          })
        }
      }

      setSubmittedId(requestId)
    } catch (err: any) {
      addToast(err.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Success screen
  if (submittedId) {
    return (
      <div className="new-request-page">
        <div className="success-screen">
          <div className="success-icon">🎉</div>
          <h1>Request Submitted!</h1>
          <p>Your request has been received. Our team will review it and reach out to you via the communication panel. You'll be notified once there's an update.</p>
          <div className="success-actions">
            <Button variant="primary" onClick={() => router.push(`/requests/${submittedId}`)}>View Request & Chat</Button>
            <Button variant="ghost" onClick={() => router.push('/requests')}>Back to All Requests</Button>
          </div>
        </div>
        <style jsx>{`
          .new-request-page { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-8); }
          .success-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; min-height: 400px; gap: var(--space-6); background: var(--bg-secondary); border-radius: 16px; border: 1px solid var(--mint-muted); padding: var(--space-16); }
          .success-icon { font-size: 64px; }
          .success-screen h1 { font-size: 32px; font-weight: 800; color: var(--mint-primary); text-shadow: var(--mint-glow); margin: 0; }
          .success-screen p { font-size: 16px; color: var(--text-secondary); line-height: 1.6; max-width: 480px; margin: 0; }
          .success-actions { display: flex; gap: var(--space-4); flex-wrap: wrap; justify-content: center; }
        `}</style>
      </div>
    )
  }


  return (
    <div className="new-request-page">
      <header className="page-header">
        <h1>Create New Request</h1>
        <p>Step {step} of 4: {step === 1 ? 'Basic Info' : step === 2 ? 'Description' : step === 3 ? 'Attachments' : 'Review'}</p>
      </header>

      <div className="stepper">
        {[1,2,3,4].map(s => (
          <div key={s} className={`step ${step >= s ? 'active' : ''} ${step === s ? 'current' : ''}`}>
             <div className="step-circle">{step > s ? <Check size={14} /> : s}</div>
             <div className="step-line" />
          </div>
        ))}
      </div>

      <Card className="form-card">
        {step === 1 && (
          <div className="step-content">
            <Input 
              label="Request Title" 
              placeholder="e.g. Dashboard redesign"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
            <div className="dual-row">
              <div className="input-group">
                <label>Category</label>
                <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                  <option value="WEBSITE">Website</option>
                  <option value="MOBILE">Mobile App</option>
                  <option value="DESIGN">Design Asset</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="input-group">
                <label>Priority</label>
                <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <label className="section-label">Describe your request in detail</label>
            <RichTextEditor 
              placeholder="Provide context, references, and specific requirements..."
              value={formData.description}
              onChange={val => setFormData({ ...formData, description: val })}
            />
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <label className="section-label">Upload supporting documents</label>
            <FileUpload 
              onFilesSelected={files => setFormData({ ...formData, files: [...formData.files, ...files] })}
            />
          </div>
        )}

        {step === 4 && (
          <div className="step-content review-step">
            <div className="review-item">
              <label>Title</label>
              <p>{formData.title}</p>
            </div>
            <div className="review-item">
              <label>Category / Priority</label>
              <p>{formData.category} • {formData.priority}</p>
            </div>
            <div className="review-item">
              <label>Description</label>
              <div dangerouslySetInnerHTML={{ __html: formData.description }} />
            </div>
            <div className="review-item">
              <label>Attachments</label>
              <p>{formData.files.length} file(s) attached</p>
            </div>
          </div>
        )}

        <div className="form-actions">
           {step > 1 && <Button variant="ghost" leftIcon={<ChevronLeft size={18} />} onClick={prevStep}>Back</Button>}
           <div style={{ flex: 1 }} />
           {step < 4 ? (
             <Button variant="primary" rightIcon={<ChevronRight size={18} />} onClick={nextStep} disabled={!formData.title}>Continue</Button>
           ) : (
             <Button variant="primary" isLoading={isLoading} onClick={handleSubmit}>Submit Request</Button>
           )}
        </div>
      </Card>

      <style jsx>{`
        .new-request-page { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-8); }
        .page-header h1 { font-size: 32px; margin-bottom: var(--space-1); }
        .page-header p { color: var(--text-secondary); }

        .stepper { display: flex; align-items: center; gap: var(--space-4); margin-bottom: var(--space-4); }
        .step { display: flex; align-items: center; gap: var(--space-4); flex: 1; }
        .step:last-child { flex: 0; }
        .step-circle { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--bg-tertiary); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: var(--text-muted); transition: all 0.3s; }
        .step-line { flex: 1; height: 2px; background: var(--bg-tertiary); transition: all 0.3s; }
        .step.active .step-circle { border-color: var(--mint-primary); color: var(--mint-primary); box-shadow: var(--mint-glow); }
        .step.active .step-line { background: var(--mint-primary); }
        .step.current .step-circle { background: var(--mint-primary); color: var(--bg-main); }
        
        .form-card { padding: var(--space-8); }
        .step-content { display: flex; flex-direction: column; gap: var(--space-8); min-height: 400px; }
        .dual-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); }
        .input-group { display: flex; flex-direction: column; gap: var(--space-2); }
        .input-group label, .section-label { font-size: 13px; font-weight: 500; color: var(--text-secondary); }
        .input-group select { background: var(--bg-tertiary); border: 1px solid transparent; border-radius: var(--radius-md); color: var(--text-primary); padding: var(--space-3) var(--space-4); outline: none; }
        
        .review-item { display: flex; flex-direction: column; gap: var(--space-1); border-bottom: 1px solid var(--bg-tertiary); padding-bottom: var(--space-4); }
        .review-item label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.1em; }
        .review-item p { font-size: 15px; }

        .form-actions { display: flex; padding-top: var(--space-8); border-top: 1px solid var(--bg-tertiary); margin-top: auto; }
      `}</style>
    </div>
  )
}
