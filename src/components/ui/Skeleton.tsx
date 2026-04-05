import React from 'react'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  variant?: 'text' | 'rect' | 'circle'
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({ width, height, variant = 'rect', className = '' }) => {
  return (
    <div className={`skeleton skeleton-${variant} ${className}`}>
      <style jsx>{`
        .skeleton {
          background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-elevated) 50%, var(--bg-tertiary) 75%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.2s infinite linear;
          width: ${typeof width === 'number' ? `${width}px` : width || '100%'};
          height: ${typeof height === 'number' ? `${height}px` : height || '1em'};
        }
        .skeleton-text { border-radius: 4px; }
        .skeleton-rect { border-radius: var(--radius-md); }
        .skeleton-circle { border-radius: 50%; }

        @keyframes skeleton-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  )
}
