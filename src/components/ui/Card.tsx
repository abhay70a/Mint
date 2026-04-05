'use client'
import React from 'react'
import BorderGlow from './BorderGlow'

interface CardProps {
  children: React.ReactNode
  title?: string
  className?: string
  clickable?: boolean
  noPadding?: boolean
  style?: React.CSSProperties
}

export const Card: React.FC<CardProps> = ({ children, title, className = '', clickable, noPadding, style }) => {
  return (
    <BorderGlow
      className={`card ${clickable ? 'clickable' : ''} ${className}`}
      borderRadius={12}
      glowColor="145 100 50"
      backgroundColor="#0A0D14"
      colors={['#00FF9D', '#00D181', '#4DABFF']}
      edgeSensitivity={25}
      glowIntensity={0.9}
      fillOpacity={0.3}
      style={{
        cursor: clickable ? 'pointer' : undefined,
        transition: 'transform var(--trans-normal)',
        ...style,
      }}
      contentStyle={{
        padding: noPadding ? '0' : 'var(--space-6)',
      }}
    >
      {title && (
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          marginBottom: 'var(--space-6)',
          color: 'var(--text-primary)',
        }}>
          {title}
        </h3>
      )}
      {children}
    </BorderGlow>
  )
}
