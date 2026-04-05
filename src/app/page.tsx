'use client'
import React from 'react'
import Link from 'next/link'

import { Footer } from '@/components/ui/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Shield, Zap, MessageSquare, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="landing-container">
      <div className="landing-bg-glow" />

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="badge">POWERING NEXT-GEN SERVICE DELIVERY</div>
          <h1>The Cyber-Tech Service platform for <span className="highlight">Modern Teams.</span></h1>
          <p>Streamline your service requests, monitor progress in real-time, and scale with a platform that feels as premium as your work.</p>
          <div className="hero-actions">
            <Link href="/signup">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={20} />}>
                Start Your Project
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg">Watch Demo</Button>
            </Link>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="dashboard-preview">
            <div className="preview-top" />
            <div className="preview-side" />
            <div className="preview-grid">
               <div className="card-mock skeleton" />
               <div className="card-mock skeleton" />
               <div className="card-mock skeleton" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="section-header">
          <h2>Engineered for Excellence</h2>
          <p>Built on the principles of speed, security, and visual clarity.</p>
        </div>

        <div className="feature-grid">
          <Card className="feature-card">
             <Shield className="icon" size={32} />
             <h3>Bank-Grade Security</h3>
             <p>Custom JWT sessions with rotation and full audit logging for every single action.</p>
          </Card>
          <Card className="feature-card">
             <Zap className="icon" size={32} />
             <h3>Perceptually Instant</h3>
             <p>Optimistic UI updates and SWR data fetching mean you never wait for a spinner.</p>
          </Card>
          <Card className="feature-card">
             <MessageSquare className="icon" size={32} />
             <h3>Direct Communication</h3>
             <p>Threaded messaging with admin-only notes and real-time status tracking.</p>
          </Card>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .landing-container {
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
        }
        .landing-bg-glow {
          position: absolute;
          top: -20%;
          right: -10%;
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(0, 255, 157, 0.15) 0%, transparent 70%);
          filter: blur(80px);
          pointer-events: none;
          z-index: -1;
        }
        .hero {
          display: flex;
          align-items: center;
          padding: var(--space-12) 10%;
          gap: var(--space-12);
          min-height: 80vh;
          position: relative;
        }
        .hero-content {
          flex: 1;
        }
        .hero-content h1 {
          font-size: 64px;
          line-height: 1.1;
          margin: var(--space-6) 0;
          letter-spacing: -0.04em;
        }
        .highlight { 
          color: var(--mint-primary); 
          text-shadow: 0 0 30px rgba(0, 255, 157, 0.4);
        }
        .hero-content p {
          font-size: 18px;
          color: var(--text-secondary);
          max-width: 500px;
          margin-bottom: var(--space-8);
          line-height: 1.6;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(0, 255, 157, 0.05);
          color: var(--mint-primary);
          border: 1px solid rgba(0, 255, 157, 0.2);
          border-radius: var(--radius-full);
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          box-shadow: 0 0 15px rgba(0, 255, 157, 0.1);
        }
        .hero-actions {
          display: flex;
          gap: var(--space-4);
        }

        .hero-visual {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          perspective: 1000px;
        }
        .dashboard-preview {
          width: 500px;
          height: 350px;
          background: rgba(10, 13, 20, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0, 255, 157, 0.15);
          border-radius: var(--radius-lg);
          transform: rotateY(-10deg) rotateX(5deg);
          box-shadow: -20px 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 255, 157, 0.1);
          display: grid;
          grid-template-columns: 80px 1fr;
          grid-template-rows: 40px 1fr;
          overflow: hidden;
        }
        .preview-top { 
          grid-column: 1 / 3; 
          background: rgba(22, 27, 34, 0.5); 
          border-bottom: 1px solid rgba(0, 255, 157, 0.1);
        }
        .preview-side { 
          grid-row: 2; 
          background: rgba(2, 4, 8, 0.5); 
          border-right: 1px solid rgba(0, 255, 157, 0.1); 
        }
        .preview-grid {
          padding: var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .card-mock { 
          height: 60px; 
          border-radius: 8px; 
          border: 1px solid rgba(0, 255, 157, 0.05);
        }

        .features {
          padding: var(--space-12) 10%;
          background: linear-gradient(to bottom, var(--bg-main), var(--bg-secondary));
          position: relative;
        }
        .features::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 157, 0.2), transparent);
        }
        .section-header {
          text-align: center;
          margin-bottom: var(--space-12);
        }
        .section-header h2 { font-size: 40px; margin-bottom: var(--space-4); letter-spacing: -0.02em; }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--space-8);
        }
        .feature-card {
           display: flex;
           flex-direction: column;
           gap: var(--space-4);
           transition: transform 0.3s var(--ease-out), box-shadow 0.3s ease;
           background: rgba(255, 255, 255, 0.02);
           border: 1px solid rgba(0, 255, 157, 0.05);
        }
        .feature-card:hover {
           border-color: rgba(0, 255, 157, 0.2);
           box-shadow: 0 10px 30px rgba(0, 255, 157, 0.05);
           transform: translateY(-4px);
        }
        .feature-card .icon { color: var(--mint-primary); }
        .feature-card h3 { font-size: 20px; color: #fff; }
        .feature-card p { color: var(--text-secondary); line-height: 1.6; }

        @media (max-width: 1024px) {
          .hero { flex-direction: column; text-align: center; padding-top: 100px; }
          .hero-content p { margin: 0 auto var(--space-8); }
          .hero-actions { justify-content: center; }
          .hero-visual { display: none; }
          .hero-content h1 { font-size: 48px; }
        }
      `}</style>
    </div>
  )
}
