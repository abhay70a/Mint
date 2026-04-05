'use client'
import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content size-${size}`} onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          {title ? <h3>{title}</h3> : <div />}
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </header>
        
        <div className="modal-body">
          {children}
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fade-in 200ms ease-out;
        }
        .modal-content {
          background: var(--bg-secondary);
          border: 1px solid var(--bg-tertiary);
          border-radius: var(--radius-lg);
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          animation: slide-up 250ms var(--ease-out);
        }
        .size-sm { width: 400px; }
        .size-md { width: 560px; }
        .size-lg { width: 800px; }
        .size-xl { width: 1024px; }

        .modal-header {
          padding: var(--space-4) var(--space-6);
          border-bottom: 1px solid var(--bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .close-btn {
          color: var(--text-secondary);
          transition: color var(--trans-fast);
        }
        .close-btn:hover {
          color: var(--text-primary);
        }
        .modal-body {
          padding: var(--space-6);
          overflow-y: auto;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
