'use client'
import React from 'react'

import { Footer } from '@/components/ui/Footer'
import { Shield, Users, Target, Rocket } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="page-container">

      
      <section className="about-hero">
        <div className="badge">OUR MISSION</div>
        <h1>Elevating Service Standards Through <span className="highlight">Technology.</span></h1>
        <p>Mint was born out of a simple observation: service-based businesses deserve the same high-fidelity software experiences as the products they create.</p>
      </section>

      <section className="vision-section">
        <div className="vision-grid">
           <div className="vision-text">
             <h2>The Mint Philosophy</h2>
             <p>We believe in "Minimal but Powerful." Every feature of our platform is engineered to remove friction, not add it. By combining top-tier security with instantaneous UI feedback, we create an environment where work feels like play.</p>
             <div className="stat-grid">
                <div className="stat"><h3>99.9%</h3><p>Uptime Guaranteed</p></div>
                <div className="stat"><h3>&lt; 100ms</h3><p>Response Latency</p></div>
             </div>
           </div>
           <div className="vision-visual">
             <div className="abstract-shape" />
           </div>
        </div>
      </section>

      <section className="values-section">
        <div className="value-item">
           <Shield className="icon" />
           <h3>Trust by Default</h3>
           <p>Immutable audit logs ensure every interaction is recorded and verified.</p>
        </div>
        <div className="value-item">
           <Users className="icon" />
           <h3>Team First</h3>
           <p>Built for distributed teams that need to stay in sync without the noise.</p>
        </div>
        <div className="value-item">
           <Target className="icon" />
           <h3>Precision Focused</h3>
           <p>Micro-interactions that communicate state changes without overwhelm.</p>
        </div>
        <div className="value-item">
           <Rocket className="icon" />
           <h3>Scale Ready</h3>
           <p>A layered architecture that grows with your business needs.</p>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .page-container { min-height: 100vh; background: var(--bg-main); }
        .about-hero { padding: var(--space-12) 10%; text-align: center; }
        .about-hero h1 { font-size: 56px; margin: var(--space-6) 0; }
        .highlight { color: var(--mint-primary); }
        .about-hero p { color: var(--text-secondary); font-size: 20px; max-width: 800px; margin: 0 auto; line-height: 1.6; }
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

        .vision-section { padding: var(--space-12) 10%; background: var(--bg-secondary); }
        .vision-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-12); align-items: center; }
        .vision-text h2 { font-size: 32px; margin-bottom: var(--space-6); }
        .vision-text p { color: var(--text-secondary); line-height: 1.8; margin-bottom: var(--space-8); }
        .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); }
        .stat h3 { color: var(--mint-primary); font-size: 24px; margin-bottom: 4px; }
        .stat p { color: var(--text-muted); font-size: 14px; }

        .vision-visual {
           height: 400px;
           background: var(--bg-elevated);
           border-radius: var(--radius-xl);
           border: 1px solid var(--bg-tertiary);
           position: relative;
           overflow: hidden;
        }
        .abstract-shape {
           position: absolute;
           top: 20%; left: 20%; width: 100%; height: 100%;
           background: radial-gradient(circle, rgba(0, 255, 157, 0.1) 0%, transparent 60%);
           border-radius: 50%;
           filter: blur(40px);
        }

        .values-section {
          padding: var(--space-12) 10%;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--space-8);
        }
        .value-item .icon { color: var(--mint-primary); margin-bottom: var(--space-4); width: 32px; height: 32px; }
        .value-item h3 { font-size: 18px; margin-bottom: var(--space-2); }
        .value-item p { color: var(--text-muted); line-height: 1.5; font-size: 14px; }

        @media (max-width: 768px) {
          .about-hero h1 { font-size: 36px; }
          .vision-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
