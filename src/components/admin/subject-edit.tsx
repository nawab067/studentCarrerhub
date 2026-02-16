import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { subject } from "@/app/admin/subjects/add-subject/page";

export interface subjectEditPageProps {
  subject?: subject | null;
  onSubmit: (subject: subject) => Promise<void>;
  loading: boolean;
}

export default function SubjectEditPage({ subject, onSubmit, loading }: subjectEditPageProps) {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedSubject: subject = {
      subject_name: formData.get("subject_name") as string,
      subjectId: formData.get("subjectId") as string,
      description: formData.get("description") as string,
    };
    await onSubmit(updatedSubject);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        .se2-wrap {
          min-height: 100vh;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .se2-card {
          width: 100%;
          max-width: 520px;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow:
            0 1px 3px rgba(0,0,0,0.04),
            0 10px 30px rgba(0,0,0,0.07);
          overflow: hidden;
        }

        /* ─── Header ─── */
        .se2-header {
          background: linear-gradient(135deg, #3b5bfa 0%, #5c7cfa 100%);
          padding: 2rem 2.5rem 2rem;
          position: relative;
          overflow: hidden;
        }
        .se2-blob1 {
          position: absolute; top: -50px; right: -50px;
          width: 180px; height: 180px;
          background: rgba(255,255,255,0.08); border-radius: 50%;
        }
        .se2-blob2 {
          position: absolute; bottom: -70px; right: 80px;
          width: 140px; height: 140px;
          background: rgba(255,255,255,0.05); border-radius: 50%;
        }
        .se2-header-top {
          display: flex; align-items: flex-start;
          justify-content: space-between;
          position: relative; z-index: 1;
        }
        .se2-header-icon {
          width: 50px; height: 50px;
          background: rgba(255,255,255,0.15);
          border-radius: 14px; display: flex;
          align-items: center; justify-content: center;
          backdrop-filter: blur(6px);
        }
        .se2-header-icon svg { color: #fff; }
        .se2-badge {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 20px; padding: 4px 12px;
          font-size: 0.7rem; font-weight: 600;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        .se2-header-title {
          font-size: 1.65rem; font-weight: 700;
          color: #fff; margin: 1rem 0 0.3rem;
          letter-spacing: -0.02em;
          position: relative; z-index: 1;
        }
        .se2-header-sub {
          font-size: 0.82rem; color: rgba(255,255,255,0.68);
          font-weight: 400; margin: 0;
          position: relative; z-index: 1;
        }

        /* ─── Preview Strip ─── */
        .se2-strip {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 1rem 2.5rem;
          display: flex; align-items: center; gap: 1rem;
        }
        .se2-strip-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #3b5bfa, #5c7cfa);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(59,91,250,0.25);
        }
        .se2-strip-icon svg { color: #fff; }
        .se2-strip-name {
          font-size: 0.9rem; font-weight: 700; color: #1e293b;
        }
        .se2-strip-sub {
          font-size: 0.75rem; color: #64748b; margin-top: 2px;
        }
        .se2-edit-chip {
          margin-left: auto;
          display: flex; align-items: center; gap: 5px;
          background: #eef2ff; border-radius: 20px;
          padding: 5px 12px;
          font-size: 0.72rem; font-weight: 600; color: #3b5bfa;
          flex-shrink: 0;
        }
        .se2-edit-chip svg { color: #3b5bfa; }

        /* ─── Body ─── */
        .se2-body { padding: 2rem 2.5rem 2.5rem; }

        /* ─── Section ─── */
        .se2-sec {
          display: flex; align-items: center;
          gap: 0.65rem; margin: 0 0 1.1rem;
        }
        .se2-sec-gap { margin-top: 1.5rem; }
        .se2-sec-pill {
          display: flex; align-items: center; gap: 6px;
          background: #eef2ff; border-radius: 20px;
          padding: 4px 12px; flex-shrink: 0;
        }
        .se2-sec-pill svg { color: #3b5bfa; }
        .se2-sec-pill span {
          font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.09em; color: #3b5bfa;
        }
        .se2-sec-line { flex: 1; height: 1px; background: #e2e8f0; }

        /* ─── Grid & fields ─── */
        .se2-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
        .se2-field { display: flex; flex-direction: column; gap: 0.45rem; margin-bottom: 1.1rem; }
        .se2-label {
          font-size: 0.775rem; font-weight: 600;
          color: #374151; letter-spacing: 0.01em;
          display: flex; align-items: center; gap: 3px;
        }
        .se2-star { color: #3b5bfa; font-size: 0.8rem; }

        /* ─── ID prefix ─── */
        .se2-id-wrap { position: relative; }
        .se2-id-prefix {
          position: absolute; left: 0.85rem; top: 50%;
          transform: translateY(-50%);
          font-size: 0.78rem; font-weight: 700;
          color: #3b5bfa; pointer-events: none; z-index: 1;
        }
        .se2-id-wrap input { padding-left: 2.2rem !important; }

        /* ─── Inputs ─── */
        .se2-body input[type="text"],
        .se2-body input[type="number"] {
          background: #f8fafc !important;
          border: 1.5px solid #e2e8f0 !important;
          border-radius: 10px !important;
          color: #1e293b !important;
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          font-size: 0.875rem !important;
          height: 44px !important;
          padding: 0 0.85rem !important;
          box-shadow: none !important;
          outline: none !important;
          transition: border-color 0.18s, background 0.18s, box-shadow 0.18s !important;
          width: 100% !important;
        }
        .se2-body input[type="text"]::placeholder,
        .se2-body input[type="number"]::placeholder {
          color: #b0bac6 !important; font-weight: 400 !important;
        }
        .se2-body input[type="text"]:focus,
        .se2-body input[type="number"]:focus {
          border-color: #3b5bfa !important;
          background: #fff !important;
          box-shadow: 0 0 0 3.5px rgba(59, 91, 250, 0.1) !important;
        }

        /* ─── Textarea ─── */
        .se2-textarea {
          background: #f8fafc !important;
          border: 1.5px solid #e2e8f0 !important;
          border-radius: 10px !important;
          color: #1e293b !important;
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          font-size: 0.875rem !important;
          padding: 0.75rem 0.85rem !important;
          box-shadow: none !important;
          outline: none !important;
          resize: none !important;
          transition: border-color 0.18s, background 0.18s, box-shadow 0.18s !important;
          width: 100% !important;
          min-height: 90px !important;
          line-height: 1.55 !important;
        }
        .se2-textarea::placeholder { color: #b0bac6 !important; font-weight: 400 !important; }
        .se2-textarea:focus {
          border-color: #3b5bfa !important;
          background: #fff !important;
          box-shadow: 0 0 0 3.5px rgba(59, 91, 250, 0.1) !important;
        }

        /* ─── Divider ─── */
        .se2-hr { height: 1px; background: #f1f5f9; margin: 1.75rem 0 1.5rem; }

        /* ─── Submit ─── */
        .se2-submit {
          width: 100%; height: 50px !important;
          border-radius: 12px !important;
          background: linear-gradient(135deg, #3b5bfa 0%, #5c7cfa 100%) !important;
          border: none !important;
          color: #fff !important;
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          font-weight: 700 !important;
          font-size: 0.9rem !important;
          letter-spacing: 0.01em !important;
          cursor: pointer !important;
          transition: transform 0.15s, box-shadow 0.15s !important;
          box-shadow: 0 4px 16px rgba(59,91,250,0.3) !important;
          display: flex !important; align-items: center !important;
          justify-content: center !important; gap: 8px !important;
        }
        .se2-submit:hover:not(:disabled) {
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 22px rgba(59,91,250,0.4) !important;
        }
        .se2-submit:active:not(:disabled) { transform: translateY(0) !important; }
        .se2-submit:disabled { opacity: 0.65 !important; cursor: not-allowed !important; }

        .se2-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: se2-spin 0.65s linear infinite; flex-shrink: 0;
        }
        @keyframes se2-spin { to { transform: rotate(360deg); } }

        .se2-footer-note {
          display: flex; align-items: center; justify-content: center;
          gap: 5px; margin-top: 1rem;
          font-size: 0.71rem; color: #94a3b8;
        }
        .se2-footer-note svg { color: #94a3b8; }

        @media (max-width: 560px) {
          .se2-row { grid-template-columns: 1fr; }
          .se2-header, .se2-body, .se2-strip { padding-left: 1.5rem; padding-right: 1.5rem; }
        }
      `}</style>

      <div className="se2-wrap">
        <div className="se2-card">

          {/* ── Header ── */}
          <div className="se2-header">
            <div className="se2-blob1" />
            <div className="se2-blob2" />
            <div className="se2-header-top">
              <div className="se2-header-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <div className="se2-badge">Edit Subject</div>
            </div>
            <h1 className="se2-header-title">Edit Subject</h1>
            <p className="se2-header-sub">Update the subject's information below</p>
          </div>

          {/* ── Preview Strip ── */}
          <div className="se2-strip">
            <div className="se2-strip-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <div>
              <div className="se2-strip-name">{subject?.subject_name || "Subject Name"}</div>
              <div className="se2-strip-sub">
                {subject?.subjectId ? `ID: ${subject.subjectId}` : "No ID assigned"}
              </div>
            </div>
            <div className="se2-edit-chip">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editing
            </div>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit}>
            <div className="se2-body">

              {/* ── Section: Subject Details ── */}
              <div className="se2-sec">
                <div className="se2-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                  <span>Subject Details</span>
                </div>
                <div className="se2-sec-line" />
              </div>

              <div className="se2-row">
                <div className="se2-field">
                  <label className="se2-label" htmlFor="subject_name">
                    Subject Name <span className="se2-star">*</span>
                  </label>
                  <Input
                    id="subject_name"
                    name="subject_name"
                    placeholder="e.g. Mathematics"
                    required
                    defaultValue={subject?.subject_name}
                  />
                </div>

                <div className="se2-field">
                  <label className="se2-label" htmlFor="subjectId">
                    Subject ID <span className="se2-star">*</span>
                  </label>
                  <div className="se2-id-wrap">
                    <span className="se2-id-prefix">#</span>
                    <Input
                      id="subjectId"
                      name="subjectId"
                      type="number"
                      placeholder="e.g. 1011"
                      required
                      defaultValue={subject?.subjectId}
                    />
                  </div>
                </div>
              </div>

              {/* ── Section: Description ── */}
              <div className="se2-sec se2-sec-gap">
                <div className="se2-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="17" y1="10" x2="3" y2="10"/>
                    <line x1="21" y1="6" x2="3" y2="6"/>
                    <line x1="21" y1="14" x2="3" y2="14"/>
                    <line x1="17" y1="18" x2="3" y2="18"/>
                  </svg>
                  <span>Description</span>
                </div>
                <div className="se2-sec-line" />
              </div>

              <div className="se2-field">
                <label className="se2-label" htmlFor="description">
                  Subject Description <span className="se2-star">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter a brief description of this subject…"
                  required
                  className="se2-textarea"
                  rows={4}
                  defaultValue={subject?.description}
                />
              </div>

              <div className="se2-hr" />

              {/* ── Submit ── */}
              <Button type="submit" className="se2-submit" disabled={loading}>
                {loading ? (
                  <><span className="se2-spinner" /> Saving Changes…</>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/>
                      <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    Save Changes
                  </>
                )}
              </Button>

              <p className="se2-footer-note">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Required fields are marked · Changes are saved securely
              </p>

            </div>
          </form>

        </div>
      </div>
    </>
  );
}