'use client'
import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, className = '', ...props }, ref) => {
    return (
      <div className={`input-group ${className}`}>
        {label && <label className="label">{label}</label>}
        <div className={`input-wrapper ${error ? 'has-error' : ''}`}>
          {leftIcon && <span className="icon">{leftIcon}</span>}
          <input ref={ref} className="input" {...props} />
        </div>
        {error && <span className="error-text">{error}</span>}
        {!error && helperText && <span className="helper-text">{helperText}</span>}

        <style jsx>{`
          .input-group {
            display: flex;
            flex-direction: column;
            gap: var(--space-2);
            width: 100%;
          }
          .label {
            font-size: 13px;
            font-weight: 500;
            color: var(--text-secondary);
          }
          .input-wrapper {
            position: relative;
            display: flex;
            align-items: center;
          }
          .input {
            width: 100%;
            background: var(--bg-tertiary);
            border: 1px solid transparent;
            border-radius: var(--radius-md);
            color: var(--text-primary);
            padding: var(--space-3) var(--space-4);
            transition: all var(--trans-fast);
            outline: none;
          }
          .input:focus {
            background: var(--bg-elevated);
            border-color: var(--mint-primary);
            box-shadow: 0 0 0 1px var(--mint-primary);
          }
          .input-wrapper.has-error .input {
            border-color: var(--error);
          }
          .input-wrapper.has-error .input:focus {
            box-shadow: 0 0 0 1px var(--error);
          }
          .icon {
            position: absolute;
            left: var(--space-4);
            color: var(--text-muted);
            pointer-events: none;
          }
          .input-wrapper:has(.icon) .input {
            padding-left: calc(var(--space-4) * 2.5);
          }
          .error-text {
            font-size: 12px;
            color: var(--error);
          }
          .helper-text {
            font-size: 12px;
            color: var(--text-muted);
          }
        `}</style>
      </div>
    )
  }
)

Input.displayName = 'Input'
