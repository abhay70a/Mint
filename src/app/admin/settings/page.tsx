'use client'
import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { Globe, Mail, Shield, Zap } from 'lucide-react'

export default function AdminSettingsPage() {
  const { addToast } = useToast()
  const [config, setConfig] = useState({
    siteName: 'Mint SaaS',
    contactEmail: 'support@mint.app',
    maintenanceMode: false,
    maxUploadSize: 25,
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    addToast('Platform configuration updated', 'success')
  }

  return (
    <div className="admin-settings">
      <header className="page-header">
        <h1>Platform Configuration</h1>
        <p>Global settings for site behavior, security, and limits.</p>
      </header>

      <div className="settings-grid">
         <section className="section">
           <h3>General Settings</h3>
           <Card>
             <form onSubmit={handleSave} className="form">
                <Input 
                  label="Platform Name"
                  value={config.siteName}
                  leftIcon={<Globe size={16} />}
                  onChange={e => setConfig({ ...config, siteName: e.target.value })}
                />
                <Input 
                  label="System Admin Email"
                  value={config.contactEmail}
                  leftIcon={<Mail size={16} />}
                  onChange={e => setConfig({ ...config, contactEmail: e.target.value })}
                />
                <Button type="submit">Save Changes</Button>
             </form>
           </Card>
         </section>

         <section className="section">
           <h3>Operational Limits</h3>
           <Card>
              <div className="form">
                <Input 
                  label="Max Upload Size (MB)"
                  type="number"
                  value={config.maxUploadSize}
                  leftIcon={<Zap size={16} />}
                  onChange={e => setConfig({ ...config, maxUploadSize: parseInt(e.target.value) })}
                />
                <div className="toggle-group">
                   <div className="text">
                      <span className="label">Maintenance Mode</span>
                      <span className="desc">Directs all traffic to a maintenance page except admins.</span>
                   </div>
                   <input 
                     type="checkbox" 
                     className="toggle"
                     checked={config.maintenanceMode}
                     onChange={e => setConfig({ ...config, maintenanceMode: e.target.checked })}
                   />
                </div>
              </div>
           </Card>
         </section>
      </div>

      <style jsx>{`
        .admin-settings { display: flex; flex-direction: column; gap: var(--space-8); max-width: 1000px; margin: 0 auto; }
        .page-header h1 { font-size: 32px; margin-bottom: var(--space-1); }
        .page-header p { color: var(--text-secondary); }

        .settings-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: var(--space-8); }
        .section { display: flex; flex-direction: column; gap: var(--space-4); }
        .section h3 { font-size: 16px; font-weight: 600; }
        
        .form { display: flex; flex-direction: column; gap: var(--space-6); }
        .toggle-group { display: flex; justify-content: space-between; align-items: center; padding: var(--space-4); background: var(--bg-tertiary); border-radius: 8px; }
        .toggle-group .text { display: flex; flex-direction: column; gap: 4px; }
        .toggle-group .label { font-size: 14px; font-weight: 600; }
        .toggle-group .desc { font-size: 12px; color: var(--text-secondary); }
        .toggle { width: 40px; height: 20px; }

        @media (max-width: 900px) { .settings-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
