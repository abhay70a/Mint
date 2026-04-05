'use client'
import React, { useState } from 'react'

import { Footer } from '@/components/ui/Footer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Mail, MessageSquare, MapPin, Send } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

export default function ContactPage() {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      await fetch("https://formsubmit.co/ajax/abhaysingh989747@gmail.com", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      addToast('Message sent! Our team will get back to you shortly.', 'success')
      form.reset()
    } catch (err) {
      addToast('Failed to send message. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">

      <section className="contact-hero">
        <div className="hero-badge">Get in Touch</div>
        <h1>Let's Start a <span className="highlight">Conversation.</span></h1>
        <p>Whether you have a specific project in mind or just want to learn more about Mint, our team is ready to connect.</p>
      </section>

      <section className="contact-grid-section">
        <div className="contact-grid">

          <div className="contact-info">
            <div className="info-card">
              <div className="icon-wrap">
                <Mail className="icon" />
              </div>
              <div className="text">
                <h4>Email Us</h4>
                <a href="mailto:abhaysingh989747@gmail.com" className="info-link">
                  abhaysingh989747@gmail.com
                </a>
              </div>
            </div>
            <div className="info-card">
              <div className="icon-wrap">
                <MessageSquare className="icon" />
              </div>
              <div className="text">
                <h4>Live Chat</h4>
                <p>Available Mon–Fri, 9am – 6pm EST</p>
              </div>
            </div>
            <div className="info-card">
              <div className="icon-wrap">
                <MapPin className="icon" />
              </div>
              <div className="text">
                <h4>Office</h4>
                <p>Lane No. 1, Arkedia Grant<br />Dehradun, Uttarakhand</p>
              </div>
            </div>

            <div className="map-placeholder">
              <MapPin size={20} className="map-pin-icon" />
              <span>Arkedia Grant, Dehradun</span>
            </div>
          </div>

          <div className="contact-form-container">
            <div className="form-header">
              <h2>Send us a message</h2>
              <p>We typically respond within 24 hours.</p>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group"><label>Full Name</label><Input name="name" required placeholder="John Doe" /></div>
                <div className="form-group"><label>Email Address</label><Input name="email" required type="email" placeholder="john@company.com" /></div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <Input name="_subject" required placeholder="How can we help?" />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" required className="text-area" placeholder="Tell us about your project or inquiry..." rows={5} />
              </div>
              <Button variant="primary" size="lg" type="submit" isLoading={loading} rightIcon={<Send size={18} />}>
                Send Message
              </Button>
            </form>
          </div>

        </div>
      </section>

      <Footer />

      <style jsx>{`
        .page-container { min-height: 100vh; background: var(--bg-main); }

        /* Hero */
        .contact-hero { padding: var(--space-12) 10% var(--space-10); text-align: center; }
        .hero-badge {
          display: inline-block;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--mint-primary);
          background: rgba(0, 255, 157, 0.08);
          border: 1px solid rgba(0, 255, 157, 0.2);
          border-radius: 100px;
          padding: 8px 24px;
          margin-bottom: var(--space-6);
        }
        .contact-hero h1 { font-size: 52px; margin-bottom: var(--space-4); line-height: 1.2; font-weight: 800; letter-spacing: -0.02em; }
        .highlight { color: var(--mint-primary); text-shadow: 0 0 40px rgba(0, 255, 157, 0.3); }
        .contact-hero p { color: var(--text-secondary); font-size: 18px; max-width: 600px; margin: 0 auto; line-height: 1.6; }

        /* Grid */
        .contact-grid-section { padding: 0 10% var(--space-16); max-width: 1400px; margin: 0 auto; }
        .contact-grid { display: grid; grid-template-columns: 1fr 1.3fr; gap: var(--space-12); align-items: stretch; }
        
        /* Info Cards */
        .contact-info { display: flex; flex-direction: column; gap: var(--space-4); justify-content: flex-start; }
        .info-card {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          padding: var(--space-6);
          border: 1px solid var(--bg-tertiary);
          border-radius: var(--radius-xl);
          background: var(--bg-secondary);
          transition: border-color 0.2s, background 0.2s;
        }
        .info-card:hover {
          border-color: rgba(0, 255, 157, 0.3);
          background: rgba(0, 255, 157, 0.02);
        }
        .icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(0, 255, 157, 0.1);
          flex-shrink: 0;
        }
        .info-card .icon { color: var(--mint-primary); width: 22px; height: 22px; }
        .info-card .text { display: flex; flex-direction: column; justify-content: center; }
        .info-card h4 { font-size: 15px; font-weight: 700; margin-bottom: 2px; color: var(--text-primary); }
        .info-card p { color: var(--text-muted); font-size: 14px; line-height: 1.4; margin: 0; }
        .info-link {
          color: var(--mint-primary);
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          word-break: break-all;
          transition: opacity 0.15s;
        }
        .info-link:hover { opacity: 0.8; }

        /* Map stub */
        .map-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
          padding: var(--space-4);
          border: 1px dashed rgba(0, 255, 157, 0.3);
          border-radius: var(--radius-xl);
          background: rgba(0, 255, 157, 0.05);
          color: var(--mint-primary);
          font-size: 14px;
          font-weight: 600;
          margin-top: 0;
          transition: background 0.2s;
        }
        .map-placeholder:hover {
           background: rgba(0, 255, 157, 0.1);
        }
        .map-pin-icon { flex-shrink: 0; }

        /* Form container */
        .contact-form-container {
          background: var(--bg-secondary);
          border: 1px solid var(--bg-tertiary);
          padding: var(--space-8);
          border-radius: var(--radius-xl);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .form-header { margin-bottom: var(--space-6); text-align: center; }
        .form-header h2 { font-size: 24px; font-weight: 800; margin-bottom: 4px; color: var(--text-primary); }
        .form-header p { color: var(--text-muted); font-size: 14px; }

        .contact-form { display: flex; flex-direction: column; gap: var(--space-5); flex: 1; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        
        .text-area {
          background: var(--bg-tertiary);
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          padding: var(--space-4);
          color: var(--text-primary);
          outline: none;
          font-family: inherit;
          font-size: 15px;
          transition: all var(--trans-fast);
          resize: vertical;
          width: 100%;
          min-height: 150px;
          box-sizing: border-box;
        }
        .text-area::placeholder { color: var(--text-muted); }
        .text-area:focus {
          background: var(--bg-elevated);
          border-color: var(--mint-primary);
          box-shadow: 0 0 0 1px var(--mint-primary);
        }

        @media (max-width: 1024px) {
          .contact-grid { grid-template-columns: 1fr; gap: 2rem; }
          .contact-hero h1 { font-size: 40px; }
          .contact-grid-section { padding: 0 5% var(--space-12); }
        }
        @media (max-width: 600px) {
          .form-row { grid-template-columns: 1fr; }
          .contact-form-container { padding: var(--space-6); }
        }
      `}</style>
    </div>
  )
}