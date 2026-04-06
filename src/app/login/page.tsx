'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { Mail, Lock } from 'lucide-react'
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { app } from '@/lib/firebase'

export default function LoginPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || 'Login failed')

      localStorage.setItem('accessToken', data.data.accessToken)
      addToast('Welcome back!', 'success')
      
      // Redirect based on role
      if (data.data.user.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      addToast(err.message, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const auth = getAuth(app)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: result.user.email,
          fullName: result.user.displayName,
          googleUid: result.user.uid
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error?.message || 'Login failed via backend')

      localStorage.setItem('accessToken', data.data.accessToken)
      
      addToast(`Welcome, ${result.user.displayName || 'User'}!`, 'success')
      
      if (data.data.user.role === 'ADMIN') {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        addToast(err.message, 'error')
      }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card-wrapper">
        <Link href="/" className="logo">MINT</Link>
        
        <Card className="auth-card">
          <div className="card-header">
             <h2>Welcome back</h2>
             <p>Sign in to your client portal</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <Input 
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              leftIcon={<Mail size={16} />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            
            <div className="password-group">
               <Input 
                label="Password"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock size={16} />}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <Link href="/forgot-password" title="Forgot Password?">Forgot?</Link>
            </div>

            <Button type="submit" isLoading={isLoading} className="submit-btn" size="lg">
              Sign In
            </Button>
            
            <div className="divider">
              <span>or connect with</span>
            </div>

            <div className="social-login">
              <button type="button" onClick={handleGoogleSignIn} className="google-btn-circle" title="Sign in with Google">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
            </div>
          </form>
          
          <div className="card-footer">
            <p>New to Mint? <Link href="/signup">Create an account</Link></p>
          </div>
        </Card>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-6);
          background: radial-gradient(circle at top right, rgba(0, 255, 157, 0.05), transparent 40%),
                      radial-gradient(circle at bottom left, rgba(0, 255, 157, 0.02), transparent 40%);
        }
        .auth-card-wrapper {
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-8);
        }
        .logo {
          font-size: 28px;
          font-weight: 800;
          color: var(--mint-primary);
          letter-spacing: 0.1em;
          text-shadow: var(--mint-glow);
        }
        .auth-card {
          width: 100%;
          border-radius: var(--radius-lg);
        }
        .card-header { text-align: center; margin-bottom: var(--space-8); }
        .card-header h2 { font-size: 24px; margin-bottom: var(--space-2); }
        .card-header p { color: var(--text-secondary); font-size: 14px; }
        
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }
        .password-group { position: relative; }
        .password-group :global(a) {
          position: absolute;
          top: 0;
          right: 0;
          font-size: 13px;
          color: var(--mint-primary);
          font-weight: 500;
        }
        .submit-btn :global(button) { width: 100%; }
        
        .divider {
          display: flex;
          align-items: center;
          text-align: center;
          color: var(--text-muted);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 4px 0;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--bg-tertiary);
        }
        .divider span { padding: 0 12px; }
        
        .social-login {
          display: flex;
          justify-content: center;
          margin-top: var(--space-2);
        }
        .google-btn-circle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255,255,255,0.03); 
          border: 1px solid rgba(255,255,255,0.08); 
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .google-btn-circle:hover {
          background: rgba(255,255,255,0.06); 
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .card-footer {
          margin-top: var(--space-8);
          text-align: center;
          font-size: 14px;
          color: var(--text-secondary);
        }
        .card-footer :global(a) { color: var(--mint-primary); font-weight: 600; }

        .card-footer :global(a) { color: var(--mint-primary); font-weight: 600; }
      `}</style>
    </div>
  )
}
