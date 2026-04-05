import React from 'react'

type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED'

interface StatusBadgeProps {
  status: Status
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const labels = {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    REJECTED: 'Rejected',
  }

  return (
    <span className={`badge badge-${status.toLowerCase().replace('_', '-')} ${className}`}>
      {status === 'PENDING' && <span className="dot pulse" />}
      {status === 'IN_PROGRESS' && <span className="dot spin" />}
      {labels[status]}
      
      <style jsx>{`
        .badge {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border: 1px solid transparent;
        }
        
        .badge-pending {
          background: rgba(255, 171, 112, 0.1);
          color: var(--warning);
          border-color: rgba(255, 171, 112, 0.2);
        }
        .badge-in-progress {
          background: rgba(77, 171, 255, 0.1);
          color: var(--info);
          border-color: rgba(77, 171, 255, 0.2);
        }
        .badge-completed {
          background: rgba(0, 255, 157, 0.1);
          color: var(--success);
          border-color: rgba(0, 255, 157, 0.2);
        }
        .badge-rejected {
          background: rgba(255, 77, 77, 0.1);
          color: var(--error);
          border-color: rgba(255, 77, 77, 0.2);
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }
        .pulse {
          animation: badge-pulse 2s infinite ease-in-out;
        }
        .spin {
          animation: badge-spin 1s infinite linear;
          border: 1px solid transparent;
          border-top-color: currentColor;
          background: transparent;
        }

        @keyframes badge-pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes badge-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </span>
  )
}
