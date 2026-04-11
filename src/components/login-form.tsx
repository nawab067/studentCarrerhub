'use client'

import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2, Mail, Lock, GraduationCap, BookOpen, Shield, Eye, EyeOff, ChevronRight } from "lucide-react"

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
    features: ['View assignments & deadlines', 'Track attendance records', 'Check your grades'],
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
    features: ['Manage classroom enrollments', 'Post & grade assessments', 'Monitor student progress'],
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
    features: ['Full institutional control', 'Manage all users & roles', 'System-wide analytics'],
  },
} as const

function IllustrationPanel({ type }: { type: string }) {
  if (type === 'student') return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 280 }}>
      <rect x="60" y="140" width="200" height="20" rx="4" fill="rgba(255,255,255,0.15)" />
      <rect x="70" y="118" width="180" height="26" rx="4" fill="rgba(255,255,255,0.20)" />
      <rect x="80" y="94" width="160" height="28" rx="4" fill="rgba(255,255,255,0.25)" />
      <polygon points="160,30 220,58 160,86 100,58" fill="rgba(255,255,255,0.30)" />
      <rect x="210" y="58" width="4" height="30" rx="2" fill="rgba(255,255,255,0.40)" />
      <circle cx="214" cy="92" r="6" fill="rgba(255,255,255,0.50)" />
      <circle cx="50" cy="50" r="3" fill="rgba(255,255,255,0.3)" />
      <circle cx="270" cy="40" r="2" fill="rgba(255,255,255,0.25)" />
      <circle cx="290" cy="120" r="4" fill="rgba(255,255,255,0.2)" />
      <rect x="80" y="190" width="160" height="8" rx="4" fill="rgba(255,255,255,0.10)" />
      <rect x="80" y="190" width="110" height="8" rx="4" fill="rgba(255,255,255,0.35)" />
      <text x="160" y="225" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="monospace">68% complete</text>
    </svg>
  )
  if (type === 'teacher') return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 280 }}>
      <rect x="50" y="40" width="220" height="130" rx="8" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
      <rect x="80" y="100" width="20" height="50" rx="3" fill="rgba(255,255,255,0.25)" />
      <rect x="112" y="80" width="20" height="70" rx="3" fill="rgba(255,255,255,0.35)" />
      <rect x="144" y="90" width="20" height="60" rx="3" fill="rgba(255,255,255,0.28)" />
      <rect x="176" y="65" width="20" height="85" rx="3" fill="rgba(255,255,255,0.40)" />
      <rect x="208" y="75" width="20" height="75" rx="3" fill="rgba(255,255,255,0.30)" />
      <line x1="70" y1="152" x2="240" y2="152" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <rect x="60" y="185" width="200" height="12" rx="4" fill="rgba(255,255,255,0.18)" />
      <rect x="90" y="197" width="8" height="30" rx="2" fill="rgba(255,255,255,0.12)" />
      <rect x="222" y="197" width="8" height="30" rx="2" fill="rgba(255,255,255,0.12)" />
    </svg>
  )
  return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 280 }}>
      <path d="M160 30 L220 55 L220 120 Q220 165 160 185 Q100 165 100 120 L100 55 Z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      <polyline points="135,110 152,128 188,90" stroke="rgba(255,255,255,0.6)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="160" cy="107" r="50" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="210" cy="107" r="5" fill="rgba(255,255,255,0.3)" />
      <circle cx="110" cy="107" r="4" fill="rgba(255,255,255,0.2)" />
      <circle cx="100" cy="210" r="14" fill="rgba(255,255,255,0.10)" />
      <circle cx="160" cy="218" r="14" fill="rgba(255,255,255,0.10)" />
      <circle cx="220" cy="210" r="14" fill="rgba(255,255,255,0.10)" />
      <line x1="114" y1="210" x2="146" y2="216" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <line x1="174" y1="216" x2="206" y2="212" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    </svg>
  )
}

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
      className={cn(className)}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        minHeight: '100vh',
        display: 'flex',
        background: '#f4f6fb',
      } as React.CSSProperties}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=DM+Mono:wght@400;500&display=swap');

        /* ── Left decorative panel ── */
        .lf-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          position: relative;
          overflow: hidden;
        }
        .lf-left-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 20px;
          max-width: 360px;
        }

        /* ── Right form panel ── */
        .lf-right {
          width: 460px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 48px;
          background: #fff;
          box-shadow: -20px 0 60px rgba(15,23,42,0.07);
        }

        .lf-card {
          width: 100%;
          max-width: 370px;
        }

        /* ── Mobile hero (top banner shown when left panel hidden) ── */
        .lf-mobile-hero {
          display: none;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 36px 24px 0;
        }
        .lf-mobile-hero-wave {
          width: 100%;
          margin-top: 20px;
          display: block;
        }

        /* ── Portal badge ── */
        .lf-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 5px 13px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          font-family: 'DM Mono', monospace;
          margin-bottom: 6px;
        }

        /* ── Input fields ── */
        .lf-input-group { margin-bottom: 16px; }
        .lf-input-group:last-of-type { margin-bottom: 0; }
        .lf-label {
          font-size: 12px;
          font-weight: 600;
          color: #334155;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 5px;
        }
        .lf-field-wrap { position: relative; }
        .lf-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #94a3b8;
        }
        .lf-input {
          width: 100%;
          padding: 11px 40px 11px 38px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #0f172a;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
          box-sizing: border-box;
        }
        .lf-input::placeholder { color: #94a3b8; }
        .lf-input:focus {
          background: #fff;
          border-color: var(--lf-accent);
          box-shadow: 0 0 0 3px var(--lf-accent-glow);
        }
        .lf-eye {
          position: absolute;
          right: 11px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          color: #94a3b8;
          display: flex;
          align-items: center;
          transition: color 0.15s;
        }
        .lf-eye:hover { color: #475569; }

        /* ── Submit button ── */
        .lf-submit {
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
          margin-top: 22px;
          transition: opacity 0.15s, transform 0.15s;
        }
        .lf-submit:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .lf-submit:active:not(:disabled) { transform: translateY(0); }
        .lf-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        /* ── Feature pills ── */
        .lf-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 12px;
          padding: 10px 14px;
          width: 100%;
          text-align: left;
        }
        .lf-pill-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,0.6); }
        .lf-pill span { font-size: 13px; color: rgba(255,255,255,0.80); font-weight: 500; }

        /* ── Animations ── */
        @keyframes lf-fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .lf-a0 { animation: lf-fadeUp 0.4s cubic-bezier(.22,.68,0,1.1) 0ms   both; }
        .lf-a1 { animation: lf-fadeUp 0.4s cubic-bezier(.22,.68,0,1.1) 60ms  both; }
        .lf-a2 { animation: lf-fadeUp 0.4s cubic-bezier(.22,.68,0,1.1) 120ms both; }
        .lf-a3 { animation: lf-fadeUp 0.4s cubic-bezier(.22,.68,0,1.1) 180ms both; }
        .lf-a4 { animation: lf-fadeUp 0.4s cubic-bezier(.22,.68,0,1.1) 240ms both; }
        .lf-a5 { animation: lf-fadeUp 0.4s cubic-bezier(.22,.68,0,1.1) 300ms both; }

        @keyframes lf-spin { to { transform: rotate(360deg); } }
        .lf-spin { animation: lf-spin 1s linear infinite; }

        @keyframes lf-pulse { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
        .lf-dot { display: inline-block; border-radius: 50%; animation: lf-pulse 2.2s ease-in-out infinite; }

        /* ════════════════════════════════
           RESPONSIVE BREAKPOINTS
           ════════════════════════════════ */

        /* Tablet: hide left, show mobile hero */
        @media (max-width: 900px) {
          .lf-root {
            flex-direction: column !important;
            background: #fff !important;
          }
          .lf-left {
            display: none !important;
          }
          .lf-mobile-hero {
            display: flex !important;
          }
          .lf-right {
            width: 100% !important;
            box-shadow: none !important;
            padding: 32px 48px 48px !important;
            align-items: flex-start !important;
            justify-content: center !important;
          }
          .lf-card {
            max-width: 480px !important;
            margin: 0 auto !important;
          }
        }

        /* Mobile */
        @media (max-width: 540px) {
          .lf-right {
            padding: 24px 20px 40px !important;
          }
          .lf-card {
            max-width: 100% !important;
          }
        }
      `}</style>

      {/* Outer flex container */}
      <div
        className="lf-root"
        style={{
          display: 'flex',
          flex: 1,
          ['--lf-accent' as string]: cfg.accent,
          ['--lf-accent-glow' as string]: `${cfg.accent}22`,
        }}
      >

        {/* ══ MOBILE HERO (shown on tablet/mobile instead of left panel) ══ */}
        <div className="lf-mobile-hero" style={{ background: cfg.gradient }}>
          <div style={{
            width: 56, height: 56, borderRadius: 18,
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 14,
          }}>
            <Icon style={{ width: 26, height: 26, color: '#fff' }} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.4px' }}>
            {cfg.label}
          </h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.6, maxWidth: 300 }}>
            {cfg.tagline}
          </p>
          {/* Wave svg to blend into white form area */}
          <svg className="lf-mobile-hero-wave" viewBox="0 0 400 32" preserveAspectRatio="none" style={{ height: 32 }}>
            <path d="M0,32 Q100,0 200,20 Q300,40 400,12 L400,32 Z" fill="#fff" />
          </svg>
        </div>

        {/* ══ LEFT decorative panel (desktop only) ══ */}
        <div className="lf-left" style={{ background: cfg.gradient }}>
          {/* Subtle overlay */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
            backgroundImage: `radial-gradient(ellipse 60% 60% at 80% 20%, rgba(255,255,255,0.07) 0%, transparent 60%)`,
          }} />
          <div className="lf-left-content">
            <div style={{
              width: 68, height: 68, borderRadius: 20,
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 36px rgba(0,0,0,0.2)',
            }}>
              <Icon style={{ width: 32, height: 32, color: '#fff' }} />
            </div>

            <IllustrationPanel type={portal} />

            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.4px', margin: '0 0 8px' }}>
                {cfg.label}
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: 0 }}>
                {cfg.tagline}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
              {cfg.features.map(t => (
                <div key={t} className="lf-pill">
                  <div className="lf-pill-dot lf-dot" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ RIGHT form panel ══ */}
        <div className="lf-right">
          <div className="lf-card">

            {/* Header */}
            <div className="lf-a0" style={{ marginBottom: 28 }}>
              <div className="lf-badge" style={{ background: cfg.accentLight, color: cfg.accent }}>
                <span className="lf-dot" style={{ width: 6, height: 6, background: cfg.accent }} />
                {cfg.label}
              </div>
              <h1 style={{
                fontSize: 26, fontWeight: 800, color: '#0f172a',
                letterSpacing: '-0.5px', margin: '4px 0 6px', lineHeight: 1.2,
              }}>
                Sign in
              </h1>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Enter your credentials to access your dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={(e) => { e.preventDefault(); onLogin?.({ email, password }) }}>

              {/* Email */}
              <div className="lf-input-group lf-a1">
                <label className="lf-label" htmlFor="lf-email">Email address</label>
                <div className="lf-field-wrap">
                  <Mail className="lf-icon" style={{ width: 15, height: 15 }} />
                  <input
                    id="lf-email"
                    type="email"
                    className="lf-input"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={onChangeEmail}
                    autoComplete="email"
                    style={{ ['--lf-accent' as string]: cfg.accent, ['--lf-accent-glow' as string]: `${cfg.accent}22` }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="lf-input-group lf-a2">
                <label className="lf-label" htmlFor="lf-password">
                  Password
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    style={{
                      fontWeight: 600, fontSize: 12, color: cfg.accent,
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif", padding: 0,
                    }}
                  >
                    Forgot password?
                  </button>
                </label>
                <div className="lf-field-wrap">
                  <Lock className="lf-icon" style={{ width: 15, height: 15 }} />
                  <input
                    id="lf-password"
                    type={showPassword ? 'text' : 'password'}
                    className="lf-input"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={onChangePassword}
                    autoComplete="current-password"
                    style={{ ['--lf-accent' as string]: cfg.accent, ['--lf-accent-glow' as string]: `${cfg.accent}22` }}
                  />
                  <button
                    type="button"
                    className="lf-eye"
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
                className="lf-submit lf-a3"
                style={{
                  background: cfg.gradient,
                  boxShadow: `0 6px 20px ${cfg.accent}35`,
                }}
              >
                {isLoading
                  ? <><Loader2 className="lf-spin" style={{ width: 16, height: 16 }} /> Signing in...</>
                  : <><span>Sign in</span><ChevronRight style={{ width: 16, height: 16 }} /></>
                }
              </button>
            </form>

            {/* Sign up */}
            {onSignUp && (
              <div className="lf-a4" style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 18 }}>
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

            {/* Secure note */}
            <div className="lf-a5" style={{
              marginTop: 28, padding: '13px 15px',
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
    </div>
  )
}