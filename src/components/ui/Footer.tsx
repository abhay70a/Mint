'use client'
import React from 'react'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="logo">MINT</div>
          <p>The premium service management platform for high-performance teams.</p>
        </div>
        <div className="footer-links">
          <div className="link-group">
            <h4>Platform</h4>
            <a href="/services">Services</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </div>
          <div className="link-group">
            <h4>Support</h4>
            <a href="#">Documentation</a>
            <a href="#">Help Center</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Mint SaaS. All rights reserved.</p>
      </div>
      <style jsx>{`
        .footer {
          padding: var(--space-12) 10%;
          border-top: 1px solid var(--bg-tertiary);
          background: var(--bg-main);
        }
        .footer-content {
          display: flex;
          justify-content: space-between;
          gap: var(--space-8);
          margin-bottom: var(--space-12);
        }
        .footer-brand {
          max-width: 300px;
        }
        .logo {
          font-size: 20px;
          font-weight: 800;
          color: var(--mint-primary);
          margin-bottom: var(--space-4);
          letter-spacing: 0.1em;
        }
        .footer-brand p {
          color: var(--text-muted);
          line-height: 1.5;
          font-size: 14px;
        }
        .footer-links {
          display: flex;
          gap: var(--space-12);
        }
        .link-group h4 {
          font-size: 14px;
          color: var(--text-primary);
          margin-bottom: var(--space-4);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .link-group a {
          display: block;
          color: var(--text-muted);
          font-size: 14px;
          margin-bottom: var(--space-2);
          text-decoration: none;
          transition: color var(--trans-fast);
        }
        .link-group a:hover { color: var(--text-primary); }
        .footer-bottom {
          padding-top: var(--space-6);
          border-top: 1px solid var(--bg-tertiary);
          text-align: center;
          color: var(--text-muted);
          font-size: 12px;
        }
        @media (max-width: 768px) {
          .footer-content { flex-direction: column; gap: var(--space-10); }
          .footer-links { flex-direction: column; gap: var(--space-8); }
        }
      `}</style>
    </footer>
  )
}
