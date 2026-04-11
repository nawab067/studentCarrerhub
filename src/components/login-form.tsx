'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Mail, Lock, GraduationCap, BookOpen, Shield, Eye, EyeOff, ChevronRight } from "lucide-react"

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
export type PortalType = 'student' | 'teacher' | 'admin'

interface LoginFormProps {
  portal?: PortalType
  email?: string
  password?: string
  onLogin?: (credentials: { email: string; password: string }) => void
  onSignUp?: () => void
  onForgotPassword?: () => void
  isLoading?: boolean
  isButtonDisabled?: boolean
  onChangeEmail: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangePassword: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
}

/* ─────────────────────────────────────────────
   Portal config
───────────────────────────────────────────── */
const PORTAL_CONFIG = {
  student: {
    label: 'Student Portal',
    tagline: 'Access your classes, grades & assignments',
    icon: GraduationCap,
    accent: '#6366f1',
    accentDark: '#4338ca',
    accentLight: '#eef2ff',
    accentMid: '#818cf8',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #6366f1 100%)',
    gradientSoft: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
    illustration: 'student',
  },
  teacher: {
    label: 'Teacher Portal',
    tagline: 'Manage your classrooms & student progress',
    icon: BookOpen,
    accent: '#0891b2',
    accentDark: '#0e7490',
    accentLight: '#ecfeff',
    accentMid: '#22d3ee',
    gradient: 'linear-gradient(135deg, #164e63 0%, #0e7490 40%, #0891b2 70%, #06b6d4 100%)',
    gradientSoft: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)',
    illustration: 'teacher',
  },
  admin: {
    label: 'Admin Portal',
    tagline: 'Full control over your institution',
    icon: Shield,
    accent: '#7c3aed',
    accentDark: '#6d28d9',
    accentLight: '#f5f3ff',
    accentMid: '#a78bfa',
    gradient: 'linear-gradient(135deg, #1e1035 0%, #2d1b69 40%, #5b21b6 70%, #7c3aed 100%)',
    gradientSoft: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
    illustration: 'admin',
  },
} as const

/* ─────────────────────────────────────────────
   Decorative SVG panels per portal
───────────────────────────────────────────── */
function IllustrationPanel({ type, accent }: { type: string; accent: string }) {
  if (type === 'student') return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 300 }}>
      {/* Book stack */}
      <rect x="60" y="140" width="200" height="20" rx="4" fill="rgba(255,255,255,0.15)" />
      <rect x="70" y="118" width="180" height="26" rx="4" fill="rgba(255,255,255,0.20)" />
      <rect x="80" y="94" width="160" height="28" rx="4" fill="rgba(255,255,255,0.25)" />
      {/* Graduation cap */}
      <polygon points="160,30 220,58 160,86 100,58" fill="rgba(255,255,255,0.30)" />
      <rect x="210" y="58" width="4" height="30" rx="2" fill="rgba(255,255,255,0.40)" />
      <circle cx="214" cy="92" r="6" fill="rgba(255,255,255,0.50)" />
      {/* Stars */}
      <circle cx="50" cy="50" r="3" fill="rgba(255,255,255,0.3)" />
      <circle cx="270" cy="40" r="2" fill="rgba(255,255,255,0.25)" />
      <circle cx="290" cy="120" r="4" fill="rgba(255,255,255,0.2)" />
      <circle cx="30" cy="160" r="2.5" fill="rgba(255,255,255,0.2)" />
      {/* Progress bar */}
      <rect x="80" y="190" width="160" height="8" rx="4" fill="rgba(255,255,255,0.10)" />
      <rect x="80" y="190" width="110" height="8" rx="4" fill="rgba(255,255,255,0.35)" />
      <text x="160" y="225" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="monospace">68% complete</text>
    </svg>
  )
  if (type === 'teacher') return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 300 }}>
      {/* Whiteboard */}
      <rect x="50" y="40" width="220" height="130" rx="8" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      {/* Chart bars on board */}
      <rect x="80" y="100" width="20" height="50" rx="3" fill="rgba(255,255,255,0.25)" />
      <rect x="112" y="80" width="20" height="70" rx="3" fill="rgba(255,255,255,0.35)" />
      <rect x="144" y="90" width="20" height="60" rx="3" fill="rgba(255,255,255,0.28)" />
      <rect x="176" y="65" width="20" height="85" rx="3" fill="rgba(255,255,255,0.40)" />
      <rect x="208" y="75" width="20" height="75" rx="3" fill="rgba(255,255,255,0.30)" />
      {/* Baseline */}
      <line x1="70" y1="152" x2="240" y2="152" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      {/* Desk */}
      <rect x="60" y="185" width="200" height="12" rx="4" fill="rgba(255,255,255,0.18)" />
      <rect x="90" y="197" width="8" height="30" rx="2" fill="rgba(255,255,255,0.12)" />
      <rect x="222" y="197" width="8" height="30" rx="2" fill="rgba(255,255,255,0.12)" />
      {/* Dots */}
      <circle cx="40" cy="80" r="3" fill="rgba(255,255,255,0.2)" />
      <circle cx="285" cy="60" r="4" fill="rgba(255,255,255,0.15)" />
      <circle cx="295" cy="170" r="2.5" fill="rgba(255,255,255,0.2)" />
    </svg>
  )
  // admin
  return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 300 }}>
      {/* Shield */}
      <path d="M160 30 L220 55 L220 120 Q220 165 160 185 Q100 165 100 120 L100 55 Z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      {/* Check inside shield */}
      <polyline points="135,110 152,128 188,90" stroke="rgba(255,255,255,0.6)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Orbiting dots */}
      <circle cx="160" cy="107" r="50" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="210" cy="107" r="5" fill="rgba(255,255,255,0.3)" />
      <circle cx="110" cy="107" r="4" fill="rgba(255,255,255,0.2)" />
      <circle cx="160" cy="57" r="4" fill="rgba(255,255,255,0.25)" />
      {/* Bottom nodes */}
      <circle cx="100" cy="210" r="14" fill="rgba(255,255,255,0.10)" />
      <circle cx="160" cy="218" r="14" fill="rgba(255,255,255,0.10)" />
      <circle cx="220" cy="210" r="14" fill="rgba(255,255,255,0.10)" />
      <line x1="114" y1="210" x2="146" y2="216" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <line x1="174" y1="216" x2="206" y2="212" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <line x1="160" y1="185" x2="160" y2="204" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    </svg>
  )
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export function LoginForm({
  className,
  portal = 'student',
  email = "",
  password = "",
  onLogin,
  onSignUp,
  onForgotPassword,
  isLoading = false,
  isButtonDisabled = false,
  onChangeEmail,
  onChangePassword,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const cfg = PORTAL_CONFIG[portal]
  const Icon = cfg.icon

  return (
    <div
      className={cn("login-root", className)}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=DM+Mono:wght@400;500&display=swap');

        /* ── Root ── */
        .login-root {
          min-height: 100vh;
          display: flex;
          background: #f4f6fb;
          background-image:
            radial-gradient(ellipse 70% 50% at 15% 0%, rgba(99,102,241,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 85% 100%, rgba(168,85,247,0.04) 0%, transparent 60%);
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Left panel (decorative) ── */
        .login-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          position: relative;
          overflow: hidden;
        }
        .login-left-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .login-left-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 24px;
          max-width: 380px;
        }

        /* ── Right panel (form) ── */
        .login-right {
          width: 480px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 48px;
          background: #fff;
          box-shadow: -20px 0 60px rgba(15,23,42,0.07);
          position: relative;
          z-index: 2;
        }

        /* ── Form card ── */
        .login-card {
          width: 100%;
          max-width: 380px;
        }

        /* ── Portal badge ── */
        .portal-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          font-family: 'DM Mono', monospace;
          margin-bottom: 8px;
        }

        /* ── Input wrapper ── */
        .input-group {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }
        .input-group:last-of-type { margin-bottom: 0; }

        .input-label {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .input-field-wrap {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 13px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #94a3b8;
        }

        .input-styled {
          width: 100%;
          padding: 11px 42px 11px 40px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #0f172a;
          outline: none;
          transition: border-color 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
          box-sizing: border-box;
        }
        .input-styled::placeholder { color: #94a3b8; }
        .input-styled:focus {
          background: #fff;
          border-color: var(--login-accent);
          box-shadow: 0 0 0 3px var(--login-accent-glow);
        }

        .input-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          color: #94a3b8;
          display: flex;
          align-items: center;
          transition: color 0.15s ease;
        }
        .input-toggle:hover { color: #475569; }

        /* ── Submit button ── */
        .submit-btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          font-size: 14px;
          font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
          transition: opacity 0.16s ease, transform 0.16s ease, box-shadow 0.16s ease;
          letter-spacing: 0.01em;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px var(--login-accent-shadow);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Divider ── */
        .form-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0;
        }
        .divider-line { flex: 1; height: 1px; background: #e8ecf4; }
        .divider-text { font-size: 11px; color: #94a3b8; font-weight: 500; white-space: nowrap; }

        /* ── Footer text ── */
        .form-footer {
          text-align: center;
          font-size: 13px;
          color: #64748b;
          margin-top: 20px;
        }

        /* ── Forgot link ── */
        .forgot-link {
          font-size: 12px;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          padding: 0;
          transition: opacity 0.15s;
        }
        .forgot-link:hover { opacity: 0.75; text-decoration: underline; }

        /* ── Entrance animations ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-0 { animation: fadeUp 0.45s cubic-bezier(.22,.68,0,1.1) 0ms   both; }
        .anim-1 { animation: fadeUp 0.45s cubic-bezier(.22,.68,0,1.1) 60ms  both; }
        .anim-2 { animation: fadeUp 0.45s cubic-bezier(.22,.68,0,1.1) 120ms both; }
        .anim-3 { animation: fadeUp 0.45s cubic-bezier(.22,.68,0,1.1) 180ms both; }
        .anim-4 { animation: fadeUp 0.45s cubic-bezier(.22,.68,0,1.1) 240ms both; }
        .anim-5 { animation: fadeUp 0.45s cubic-bezier(.22,.68,0,1.1) 300ms both; }

        @keyframes floatIn {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .anim-float { animation: floatIn 0.6s cubic-bezier(.22,.68,0,1.15) 100ms both; }

        /* ── Dot pulse (left panel) ── */
        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .pulse-dot {
          width: 7px; height: 7px; border-radius: 50%;
          animation: pulseDot 2.2s ease-in-out infinite;
          display: inline-block;
        }

        /* ── Left panel feature pills ── */
        .feature-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 12px;
          padding: 10px 16px;
          backdrop-filter: blur(8px);
          width: 100%;
          text-align: left;
        }
        .feature-pill-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(255,255,255,0.6); flex-shrink: 0;
        }
        .feature-pill-text {
          font-size: 13px;
          color: rgba(255,255,255,0.80);
          font-weight: 500;
        }

        /* ── RESPONSIVE ── */

        /* Tablet: hide left panel below 900px */
        @media (max-width: 900px) {
          .login-left { display: none; }
          .login-right {
            width: 100%;
            box-shadow: none;
            padding: 32px 32px;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
        }

        /* Mobile */
        @media (max-width: 640px) {
          .login-root { background: #fff; }
          .login-right {
            padding: 32px 20px 40px;
            background: #fff;
          }
          .login-card { max-width: 100%; }

          .login-mobile-hero {
            display: flex !important;
          }
        }

        /* Desktop: show mobile hero never */
        .login-mobile-hero { display: none; }
      `}</style>

      {/* CSS variable injection */}
      <div style={{
        '--login-accent': cfg.accent,
        '--login-accent-dark': cfg.accentDark,
        '--login-accent-glow': `${cfg.accent}22`,
        '--login-accent-shadow': `${cfg.accent}40`,
        display: 'contents',
      } as React.CSSProperties} className="login-root" />

      {/* ══ LEFT decorative panel ══ */}
      <div className="login-left" style={{ '--login-accent': cfg.accent } as React.CSSProperties}>
        {/* Gradient background */}
        <div className="login-left-bg" style={{ background: cfg.gradient }} />

        {/* Decorative dots overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: `
            radial-gradient(ellipse 60% 60% at 80% 20%, rgba(255,255,255,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 60%)
          `,
        }} />

        <div className="login-left-content anim-float">
          {/* Logo mark */}
          <div style={{
            width: 72, height: 72, borderRadius: 22,
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
          }}>
            <Icon style={{ width: 34, height: 34, color: '#fff' }} />
          </div>

          {/* Illustration */}
          <IllustrationPanel type={cfg.illustration} accent={cfg.accent} />

          {/* Heading */}
          <div>
            <h2 style={{
              fontSize: 26, fontWeight: 800, color: '#fff',
              letterSpacing: '-0.5px', margin: '0 0 8px',
              textShadow: '0 2px 12px rgba(0,0,0,0.2)',
            }}>
              {cfg.label}
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: 0 }}>
              {cfg.tagline}
            </p>
          </div>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
            {portal === 'student' && ['View assignments & deadlines', 'Track attendance records', 'Check your grades'].map(t => (
              <div key={t} className="feature-pill">
                <div className="feature-pill-dot pulse-dot" />
                <span className="feature-pill-text">{t}</span>
              </div>
            ))}
            {portal === 'teacher' && ['Manage classroom enrollments', 'Post & grade assessments', 'Monitor student progress'].map(t => (
              <div key={t} className="feature-pill">
                <div className="feature-pill-dot pulse-dot" />
                <span className="feature-pill-text">{t}</span>
              </div>
            ))}
            {portal === 'admin' && ['Full institutional control', 'Manage all users & roles', 'System-wide analytics'].map(t => (
              <div key={t} className="feature-pill">
                <div className="feature-pill-dot pulse-dot" />
                <span className="feature-pill-text">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ RIGHT form panel ══ */}
      <div className="login-right" style={{ '--login-accent': cfg.accent } as React.CSSProperties}>
        <div className="login-card">

          {/* Mobile hero header (shows when left panel is hidden) */}
          <div className="login-mobile-hero" style={{
            flexDirection: 'column', alignItems: 'center', gap: 12,
            marginBottom: 32, textAlign: 'center',
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: 18,
              background: cfg.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 8px 28px ${cfg.accent}40`,
            }}>
              <Icon style={{ width: 28, height: 28, color: '#fff' }} />
            </div>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: cfg.accentLight, border: `1px solid ${cfg.accent}22`,
                borderRadius: 999, padding: '3px 12px', marginBottom: 8,
              }}>
                <span className="pulse-dot" style={{ background: cfg.accent, width: 6, height: 6 }} />
                <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", fontWeight: 700, color: cfg.accent, letterSpacing: '0.06em' }}>
                  {cfg.label.toUpperCase()}
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                {cfg.tagline}
              </p>
            </div>
          </div>

          {/* Form header */}
          <div className="anim-0" style={{ marginBottom: 32 }}>
            <div className="portal-badge" style={{ background: cfg.accentLight, color: cfg.accent }}>
              <span className="pulse-dot" style={{ background: cfg.accent, width: 6, height: 6 }} />
              {cfg.label}
            </div>
            <h1 style={{
              fontSize: 28, fontWeight: 800, color: '#0f172a',
              letterSpacing: '-0.6px', margin: '4px 0 8px', lineHeight: 1.2,
            }}>
              Sign in
            </h1>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
              Enter your credentials to access your dashboard
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onLogin?.({ email, password })
            }}
          >
            {/* Email */}
            <div className="input-group anim-1">
              <label className="input-label" htmlFor="login-email">
                Email address
              </label>
              <div className="input-field-wrap">
                <Mail className="input-icon" style={{ width: 15, height: 15 }} />
                <input
                  id="login-email"
                  type="email"
                  className="input-styled"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={onChangeEmail}
                  autoComplete="email"
                  style={{ '--login-accent': cfg.accent, '--login-accent-glow': `${cfg.accent}22` } as React.CSSProperties}
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group anim-2">
              <label className="input-label" htmlFor="login-password">
                Password
                <button
                  type="button"
                  className="forgot-link"
                  style={{ color: cfg.accent }}
                  onClick={onForgotPassword}
                >
                  Forgot password?
                </button>
              </label>
              <div className="input-field-wrap">
                <Lock className="input-icon" style={{ width: 15, height: 15 }} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-styled"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={onChangePassword}
                  autoComplete="current-password"
                  style={{ '--login-accent': cfg.accent, '--login-accent-glow': `${cfg.accent}22` } as React.CSSProperties}
                />
                <button
                  type="button"
                  className="input-toggle"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword
                    ? <EyeOff style={{ width: 15, height: 15 }} />
                    : <Eye style={{ width: 15, height: 15 }} />
                  }
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isButtonDisabled || isLoading}
              className="submit-btn anim-3"
              style={{
                background: cfg.gradient,
                boxShadow: `0 6px 20px ${cfg.accent}35`,
                '--login-accent-shadow': `${cfg.accent}40`,
              } as React.CSSProperties}
            >
              {isLoading
                ? <><Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> Signing in...</>
                : <><span>Sign in</span><ChevronRight style={{ width: 16, height: 16 }} /></>
              }
            </button>
          </form>

          {/* Sign up footer */}
          {onSignUp && (
            <div className="form-footer anim-4">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onSignUp}
                style={{
                  fontWeight: 700, color: cfg.accent, background: 'none',
                  border: 'none', cursor: 'pointer', fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif", padding: 0,
                }}
              >
                Create one →
              </button>
            </div>
          )}

          {/* Subtle bottom note */}
          <div className="anim-5" style={{
            marginTop: 32, padding: '14px 16px',
            background: cfg.accentLight,
            border: `1px solid ${cfg.accent}18`,
            borderRadius: 12,
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: cfg.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon style={{ width: 13, height: 13, color: '#fff' }} />
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: cfg.accentDark, margin: '0 0 2px' }}>
                Secure access
              </p>
              <p style={{ fontSize: 11, color: cfg.accent, margin: 0, lineHeight: 1.5, opacity: 0.85 }}>
                Your session is encrypted and protected. Never share your credentials.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}