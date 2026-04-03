'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClipboardCheck, Hash, Percent, X } from 'lucide-react';

interface AssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    name?: string;
    marks?: number;
    weightage?: number;
  } | null;
  loading?: boolean;
}

export default function AssessmentDialog({
  open,
  onOpenChange,
  data,
  loading,
}: AssessmentDialogProps) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');

        .assess-dialog-overlay {
          backdrop-filter: blur(6px) !important;
          background: rgba(15,23,42,0.45) !important;
        }

        .assess-dialog-content {
          font-family: 'DM Sans', sans-serif !important;
          border-radius: 20px !important;
          border: 1px solid #e8ecf4 !important;
          padding: 0 !important;
          overflow: hidden !important;
          box-shadow: 0 32px 80px rgba(15,23,42,0.18), 0 8px 24px rgba(15,23,42,0.10) !important;
          max-width: 420px !important;
        }

        /* ── Shimmer ── */
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        .skel-line {
          background: linear-gradient(90deg,#eef0f6 25%,#e4e8f2 50%,#eef0f6 75%);
          background-size: 400px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 8px;
        }

        /* ── Row hover ── */
        .detail-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 24px;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s ease;
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-row:hover { background: #f8fafc; }

        /* ── Score ring shimmer-in ── */
        @keyframes ringIn {
          from { stroke-dashoffset: 220; }
          to   { stroke-dashoffset: var(--offset); }
        }
        .score-ring { animation: ringIn 0.9s cubic-bezier(.22,.68,0,1.1) forwards; }

        /* ── Fade-up ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.35s ease forwards; }
      `}</style>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="assess-dialog-content">

          {/* ── Header gradient band ── */}
          <div style={{
            background: 'linear-gradient(135deg,#3730a3 0%,#6366f1 60%,#818cf8 100%)',
            padding: '24px 24px 20px',
            position: 'relative',
          }}>
            {/* Subtle mesh circles */}
            <div style={{
              position: 'absolute', top: -30, right: -30,
              width: 120, height: 120, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: -20, left: 60,
              width: 80, height: 80, borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              pointerEvents: 'none',
            }} />

            <DialogHeader style={{ position: 'relative' }}>
              {/* Icon badge */}
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12,
              }}>
                <ClipboardCheck style={{ width: 18, height: 18, color: '#fff' }} />
              </div>

              <DialogTitle style={{
                fontSize: 18, fontWeight: 700, color: '#fff',
                letterSpacing: '-0.3px', fontFamily: "'DM Sans', sans-serif",
              }}>
                Assessment Details
              </DialogTitle>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 3 }}>
                {data?.name ? data.name : 'Full breakdown below'}
              </p>
            </DialogHeader>
          </div>

          {/* ── Body ── */}
          <div style={{ background: '#fff' }}>

            {/* Loading state */}
            {loading && (
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[80, 60, 70].map((w, i) => (
                  <div key={i} className="skel-line" style={{ height: 18, width: `${w}%` }} />
                ))}
              </div>
            )}

            {/* No data */}
            {!loading && !data && (
              <div style={{ padding: '36px 24px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
                <p style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>No data available</p>
              </div>
            )}

            {/* Data rows */}
            {!loading && data && (
              <div className="fade-up">

                {/* Marks score visual */}
                {(data.marks !== undefined || data.weightage !== undefined) && (
                  <div style={{
                    display: 'flex', justifyContent: 'center', gap: 24,
                    padding: '20px 24px 4px',
                  }}>

                    {/* Marks donut */}
                    {data.marks !== undefined && (
                      <ScoreRing
                        value={data.marks}
                        max={100}
                        label="Marks"
                        color="#6366f1"
                        trackColor="#eef2ff"
                      />
                    )}

                    {/* Weightage donut */}
                    {data.weightage !== undefined && (
                      <ScoreRing
                        value={data.weightage}
                        max={100}
                        label="Weightage"
                        color="#a855f7"
                        trackColor="#fdf4ff"
                        suffix="%"
                      />
                    )}
                  </div>
                )}

                {/* Detail rows */}
                <div style={{ marginTop: 8 }}>
                  <div className="detail-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <ClipboardCheck style={{ width: 13, height: 13, color: '#6366f1' }} />
                      </div>
                      <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Assessment Name</span>
                    </div>
                    <span style={{
                      fontSize: 13, fontWeight: 650, color: '#0f172a',
                      maxWidth: 160, textAlign: 'right',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {data.name || '—'}
                    </span>
                  </div>

                  <div className="detail-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Hash style={{ width: 13, height: 13, color: '#6366f1' }} />
                      </div>
                      <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Marks Obtained</span>
                    </div>
                    <span style={{
                      fontSize: 14, fontWeight: 700, color: '#6366f1',
                      fontFamily: "'DM Mono', monospace",
                      background: '#eef2ff', padding: '3px 10px', borderRadius: 8,
                    }}>
                      {data.marks ?? '—'}
                    </span>
                  </div>

                  <div className="detail-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: '#fdf4ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Percent style={{ width: 13, height: 13, color: '#a855f7' }} />
                      </div>
                      <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Weightage</span>
                    </div>
                    <span style={{
                      fontSize: 14, fontWeight: 700, color: '#a855f7',
                      fontFamily: "'DM Mono', monospace",
                      background: '#fdf4ff', padding: '3px 10px', borderRadius: 8,
                    }}>
                      {data.weightage ?? '—'}%
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div style={{
                  padding: '12px 24px 20px',
                  display: 'flex', justifyContent: 'flex-end',
                }}>
                  <button
                    onClick={() => onOpenChange(false)}
                    style={{
                      padding: '9px 22px', borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: 'linear-gradient(135deg,#3730a3,#6366f1)',
                      color: '#fff', fontSize: 13, fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      boxShadow: '0 4px 14px rgba(99,102,241,.35)',
                      transition: 'opacity 0.15s ease, transform 0.15s ease',
                    }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.opacity = '0.88'; (e.target as HTMLElement).style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.opacity = '1'; (e.target as HTMLElement).style.transform = 'translateY(0)'; }}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ══════════ Score Ring ══════════ */
function ScoreRing({
  value, max, label, color, trackColor, suffix = '',
}: {
  value: number; max: number; label: string;
  color: string; trackColor: string; suffix?: string;
}) {
  const radius = 34;
  const circ = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(value / max, 0), 1);
  const offset = circ * (1 - pct);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx="40" cy="40" r={radius} fill="none" stroke={trackColor} strokeWidth="7" />
          {/* Progress */}
          <circle
            cx="40" cy="40" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="score-ring"
            style={{ '--offset': offset } as React.CSSProperties}
          />
        </svg>
        {/* Center value */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <span style={{
            fontSize: 15, fontWeight: 700, color,
            fontFamily: "'DM Mono', monospace", lineHeight: 1,
          }}>
            {value}{suffix}
          </span>
        </div>
      </div>
      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  );
}