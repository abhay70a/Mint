'use client'
import React, { useState, useEffect, createContext, useContext } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 5000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div className="toast-icon">
              {toast.type === 'success' && <CheckCircle size={18} />}
              {toast.type === 'error' && <AlertCircle size={18} />}
              {toast.type === 'info' && <Info size={18} />}
            </div>
            <p className="toast-message">{toast.message}</p>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .toast-container {
          position: fixed;
          bottom: var(--space-8);
          right: var(--space-8);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          z-index: 2000;
        }
        .toast {
          background: var(--bg-elevated);
          border: 1px solid var(--bg-tertiary);
          border-radius: var(--radius-md);
          padding: var(--space-3) var(--space-4);
          display: flex;
          align-items: center;
          gap: var(--space-3);
          min-width: 300px;
          max-width: 480px;
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.5);
          animation: slide-in 200ms var(--ease-out);
        }
        
        .toast-success { border-left: 3px solid var(--success); }
        .toast-error { border-left: 3px solid var(--error); }
        .toast-info { border-left: 3px solid var(--info); }
        
        .toast-icon { color: inherit; flex-shrink: 0; }
        .toast-success .toast-icon { color: var(--success); }
        .toast-error .toast-icon { color: var(--error); }
        .toast-info .toast-icon { color: var(--info); }
        
        .toast-message { font-size: 14px; color: var(--text-primary); flex: 1; }
        .toast-close { color: var(--text-muted); transition: color var(--trans-fast); }
        .toast-close:hover { color: var(--text-primary); }

        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
