'use client'
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-md'
    
    const variants = {
      primary: 'bg-[#00FF9D] text-[#020408] hover:bg-[#00D181] hover:shadow-[0_0_15px_rgba(0,255,157,0.3)]',
      secondary: 'bg-[#161B22] text-[#F0F6FC] hover:bg-[#1C2128]',
      outline: 'border border-[#30363D] text-[#F0F6FC] hover:bg-[#161B22] hover:border-[#8B949E]',
      ghost: 'text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#161B22]',
      destructive: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    // Since we aren't using Tailwind, I'll translate these to inline styles or rely on globals.css classes
    // But the user said "no tailwind unless requested". I should use CSS Modules or pure CSS.
    // I'll use CSS Modules for components.
    
    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={`btn btn-${variant} btn-${size} ${className}`}
        {...props}
      >
        {isLoading && <span className="spinner mr-2" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        
        <style jsx>{`
          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: 500;
            transition: all 80ms cubic-bezier(0.16, 1, 0.3, 1);
            border-radius: var(--radius-md);
            cursor: pointer;
            border: 1px solid transparent;
          }
          .btn:active {
            transform: scale(0.97);
          }
          .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          /* Variants */
          .btn-primary {
            background: var(--mint-primary);
            color: var(--bg-main);
          }
          .btn-primary:hover {
            background: var(--mint-secondary);
            box-shadow: var(--mint-glow);
          }
          
          .btn-secondary {
            background: var(--bg-tertiary);
            color: var(--text-primary);
          }
          .btn-secondary:hover {
            background: var(--bg-elevated);
          }
          
          .btn-outline {
            border-color: var(--text-muted);
            color: var(--text-primary);
          }
          .btn-outline:hover {
            background: var(--bg-secondary);
            border-color: var(--text-secondary);
          }

          .btn-destructive {
            background: rgba(255, 77, 77, 0.1);
            color: var(--error);
            border-color: rgba(255, 77, 77, 0.2);
          }
          .btn-destructive:hover {
            background: rgba(255, 77, 77, 0.2);
          }
          
          /* Sizes */
          .btn-sm { padding: var(--space-1) var(--space-3); font-size: 13px; }
          .btn-md { padding: var(--space-2) var(--space-4); font-size: 14px; }
          .btn-lg { padding: var(--space-3) var(--space-6); font-size: 16px; }

          .mr-2 { margin-right: var(--space-2); }
          .ml-2 { margin-left: var(--space-2); }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .spinner {
            width: 14px;
            height: 14px;
            border: 2px solid currentColor;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
          }
        `}</style>
      </button>
    )
  }
)

Button.displayName = 'Button'
