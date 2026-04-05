'use client'
import React from 'react'

import { Footer } from '@/components/ui/Footer'
import { Card } from '@/components/ui/Card'
import { Zap, Code, Layout, Shield, Globe, Cpu } from 'lucide-react'

export default function ServicesPage() {
  const services = [
    { icon: <Code size={32} />, title: "Full-Stack Development", desc: "Expert development of modern web applications using the latest tech stacks." },
    { icon: <Layout size={32} />, title: "UI/UX Design", desc: "Crafting premium user experiences that focus on both beauty and function." },
    { icon: <Cpu size={32} />, title: "AI Integration", desc: "Implementing cutting-edge artificial intelligence into your existing workflows." },
    { icon: <Shield size={32} />, title: "System Security", desc: "High-level security audits and hardened system implementations." },
    { icon: <Globe size={32} />, title: "Cloud Architecture", desc: "Scalable infrastructure design for globally distributed applications." },
    { icon: <Zap size={32} />, title: "Performance Tuning", desc: "Optimizing your systems for perceptually instant load times." }
  ]

  return (
    <div className="page-container">

      
      <header className="page-header">
        <div className="badge">OUR EXPERTISE</div>
        <h1>Elevate Your Digital Operations</h1>
        <p>Premium service delivery tailored for teams that demand excellence.</p>
      </header>

      <section className="services-grid-section">
        <div className="services-grid">
          {services.map((s, i) => (
            <Card key={i} className="service-card">
              <div className="icon-box">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-card">
          <h2>Ready to start your next project?</h2>
          <p>Join the ranks of high-performance teams powered by Mint.</p>
          <a href="/signup" className="cta-btn">Get Started Now</a>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .page-container { min-height: 100vh; background: var(--bg-main); }
        .page-header { padding: var(--space-12) 10%; text-align: center; }
        .page-header h1 { font-size: 48px; margin: var(--space-4) 0; }
        .page-header p { color: var(--text-secondary); font-size: 18px; max-width: 600px; margin: 0 auto; }
        .badge {
          display: inline-block;
          padding: 4px 12px;
          background: var(--mint-muted);
          color: var(--mint-primary);
          border: 1px solid rgba(0, 255, 157, 0.2);
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .services-grid-section { padding: 0 10% var(--space-12); }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: var(--space-6);
        }
        .service-card { transition: transform var(--trans-normal); }
        .service-card:hover { transform: translateY(-8px); }
        .icon-box { color: var(--mint-primary); margin-bottom: var(--space-4); }
        .service-card h3 { font-size: 20px; margin-bottom: var(--space-3); }
        .service-card p { color: var(--text-secondary); line-height: 1.6; }

        .cta-section { padding: var(--space-12) 10%; }
        .cta-card {
           background: linear-gradient(135deg, var(--bg-secondary), var(--bg-elevated));
           border: 1px solid var(--bg-tertiary);
           padding: var(--space-12);
           border-radius: var(--radius-xl);
           text-align: center;
           position: relative;
           overflow: hidden;
        }
        .cta-card::after {
          content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(0, 255, 157, 0.05) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-card h2 { font-size: 32px; margin-bottom: var(--space-4); }
        .cta-card p { color: var(--text-secondary); margin-bottom: var(--space-8); }
        .cta-btn {
          display: inline-block;
          background: var(--mint-primary);
          color: var(--bg-main);
          padding: 12px 32px;
          border-radius: var(--radius-md);
          font-weight: 700;
          text-decoration: none;
          transition: all var(--trans-fast);
          box-shadow: var(--mint-glow);
        }
        .cta-btn:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }

        @media (max-width: 768px) {
          .page-header h1 { font-size: 36px; }
          .services-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
