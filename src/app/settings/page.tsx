'use client'
import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { User, Mail, Lock, Shield } from 'lucide-react'

export default function SettingsPage() {
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState({ fullName: '', email: '', role: '' })
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const res = await fetch('/api/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        setProfile(data.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchProfile()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fullName: profile.fullName })
      })
      if (!res.ok) throw new Error('Update failed')
      addToast('Profile updated successfully', 'success')
    } catch (err) {
      addToast('Failed to update profile', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.new !== passwords.confirm) {
      return addToast('Passwords do not match', 'error')
    }
    // Implement password update logic...
    addToast('Security settings updated', 'success')
    setPasswords({ current: '', new: '', confirm: '' })
  }

  return (
    <div className="settings-page">
      <header className="page-header">
        <h1>Account Settings</h1>
        <p>Manage your profile and platform preferences.</p>
      </header>

      <div className="settings-grid">
        <section className="section">
          <h3>Profile Information</h3>
          <Card>
            <form onSubmit={handleUpdateProfile} className="form">
              <Input 
                label="Full Name"
                value={profile.fullName}
                leftIcon={<User size={16} />}
                onChange={e => setProfile({ ...profile, fullName: e.target.value })}
              />
              <Input 
                label="Email Address"
                value={profile.email}
                leftIcon={<Mail size={16} />}
                disabled
                helperText="Email cannot be changed."
              />
              <div className="role-badge">
                 <Shield size={14} />
                 <span>Role: {profile.role}</span>
              </div>
              <Button type="submit" isLoading={isLoading}>Save Changes</Button>
            </form>
          </Card>
        </section>

        <section className="section">
          <h3>Security & Password</h3>
          <Card>
            <form onSubmit={handleUpdatePassword} className="form">
              <Input 
                label="Current Password"
                type="password"
                leftIcon={<Lock size={16} />}
                value={passwords.current}
                onChange={e => setPasswords({ ...passwords, current: e.target.value })}
              />
               <Input 
                label="New Password"
                type="password"
                leftIcon={<Lock size={16} />}
                value={passwords.new}
                onChange={e => setPasswords({ ...passwords, new: e.target.value })}
              />
               <Input 
                label="Confirm New Password"
                type="password"
                leftIcon={<Lock size={16} />}
                value={passwords.confirm}
                onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
              />
              <Button type="submit" variant="secondary">Update Password</Button>
            </form>
          </Card>
        </section>
      </div>

      <style jsx>{`
        .settings-page { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-8); }
        .page-header h1 { font-size: 32px; margin-bottom: var(--space-1); }
        .page-header p { color: var(--text-secondary); }

        .settings-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: var(--space-8); }
        .section { display: flex; flex-direction: column; gap: var(--space-4); }
        .section h3 { font-size: 16px; font-weight: 600; color: var(--text-primary); }
        
        .form { display: flex; flex-direction: column; gap: var(--space-6); }
        .role-badge { display: flex; align-items: center; gap: var(--space-2); font-size: 12px; font-weight: 600; color: var(--text-muted); background: var(--bg-tertiary); padding: 4px 8px; border-radius: 4px; align-self: flex-start; }

        @media (max-width: 900px) { .settings-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
