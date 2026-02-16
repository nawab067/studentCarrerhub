import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { teacher } from "@/app/admin/classroom/types";

export interface ClassroomAddPageProps {
  onSubmit: (data: { classroom_name: string; teacherId: string }) => Promise<void>;
  loading: boolean;
  teacher: teacher[];
}

export default function ClassroomAddPage({
  onSubmit,
  loading,
  teacher,
}: ClassroomAddPageProps) {
  const [classroomName, setClassroomName] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!classroomName) {
      alert("Please enter classroom name");
      return;
    }

    if (!selectedTeacher) {
      alert("Please select a teacher");
      return;
    }

    await onSubmit({
      classroom_name: classroomName,
      teacherId: selectedTeacher,
    });
  };

  const selectedTeacherName = teacher.find((t) => t._id === selectedTeacher)?.name;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        .cr-wrap {
          min-height: 100vh;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .cr-card {
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
        .cr-header {
          background: linear-gradient(135deg, #3b5bfa 0%, #5c7cfa 100%);
          padding: 2rem 2.5rem 2rem;
          position: relative;
          overflow: hidden;
        }
        .cr-header-blob1 {
          position: absolute; top: -50px; right: -50px;
          width: 180px; height: 180px;
          background: rgba(255,255,255,0.08); border-radius: 50%;
        }
        .cr-header-blob2 {
          position: absolute; bottom: -70px; right: 80px;
          width: 140px; height: 140px;
          background: rgba(255,255,255,0.05); border-radius: 50%;
        }
        .cr-header-top {
          display: flex; align-items: flex-start;
          justify-content: space-between;
          position: relative; z-index: 1;
        }
        .cr-header-icon {
          width: 50px; height: 50px;
          background: rgba(255,255,255,0.15);
          border-radius: 14px; display: flex;
          align-items: center; justify-content: center;
          backdrop-filter: blur(6px);
        }
        .cr-header-icon svg { color: #fff; }
        .cr-header-badge {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 20px; padding: 4px 12px;
          font-size: 0.7rem; font-weight: 600;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        .cr-header-title {
          font-size: 1.65rem; font-weight: 700;
          color: #fff; margin: 1rem 0 0.3rem;
          letter-spacing: -0.02em;
          position: relative; z-index: 1;
        }
        .cr-header-sub {
          font-size: 0.82rem; color: rgba(255,255,255,0.68);
          font-weight: 400; margin: 0;
          position: relative; z-index: 1;
        }

        /* ─── Preview strip ─── */
        .cr-preview-strip {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 1rem 2.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .cr-preview-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #3b5bfa, #5c7cfa);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(59,91,250,0.25);
        }
        .cr-preview-icon svg { color: #fff; }
        .cr-preview-name {
          font-size: 0.9rem; font-weight: 700; color: #1e293b;
        }
        .cr-preview-sub {
          font-size: 0.75rem; color: #64748b; margin-top: 2px;
        }
        .cr-new-chip {
          margin-left: auto;
          display: flex; align-items: center; gap: 5px;
          background: #eef2ff; border-radius: 20px;
          padding: 5px 12px;
          font-size: 0.72rem; font-weight: 600; color: #3b5bfa;
          flex-shrink: 0;
        }
        .cr-new-chip svg { color: #3b5bfa; }

        /* ─── Body ─── */
        .cr-body { padding: 2rem 2.5rem 2.5rem; }

        /* ─── Section divider ─── */
        .cr-sec {
          display: flex; align-items: center;
          gap: 0.65rem; margin: 0 0 1.1rem;
        }
        .cr-sec-pill {
          display: flex; align-items: center; gap: 6px;
          background: #eef2ff; border-radius: 20px;
          padding: 4px 12px; flex-shrink: 0;
        }
        .cr-sec-pill svg { color: #3b5bfa; }
        .cr-sec-pill span {
          font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.09em;
          color: #3b5bfa;
        }
        .cr-sec-line { flex: 1; height: 1px; background: #e2e8f0; }

        .cr-field { display: flex; flex-direction: column; gap: 0.45rem; margin-bottom: 1.25rem; }
        .cr-label {
          font-size: 0.775rem; font-weight: 600;
          color: #374151; letter-spacing: 0.01em;
          display: flex; align-items: center; gap: 3px;
        }
        .cr-star { color: #3b5bfa; font-size: 0.8rem; }

        /* ─── Input overrides ─── */
        .cr-body input[type="text"] {
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
        .cr-body input[type="text"]::placeholder {
          color: #b0bac6 !important; font-weight: 400 !important;
        }
        .cr-body input[type="text"]:focus {
          border-color: #3b5bfa !important;
          background: #fff !important;
          box-shadow: 0 0 0 3.5px rgba(59, 91, 250, 0.1) !important;
        }

        /* ─── Select overrides ─── */
        .cr-body button[role="combobox"] {
          background: #f8fafc !important;
          border: 1.5px solid #e2e8f0 !important;
          border-radius: 10px !important;
          color: #1e293b !important;
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          font-size: 0.875rem !important;
          height: 44px !important;
          padding: 0 0.85rem !important;
          width: 100% !important;
          transition: border-color 0.18s, background 0.18s, box-shadow 0.18s !important;
          box-shadow: none !important;
        }
        .cr-body button[role="combobox"]:focus,
        .cr-body button[role="combobox"][data-state="open"] {
          border-color: #3b5bfa !important;
          background: #fff !important;
          box-shadow: 0 0 0 3.5px rgba(59, 91, 250, 0.1) !important;
          outline: none !important;
        }

        /* ─── Teacher count badge ─── */
        .cr-teacher-meta {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: 0.45rem;
        }
        .cr-teacher-count {
          font-size: 0.7rem; color: #94a3b8; font-weight: 500;
        }
        .cr-teacher-count span {
          color: #3b5bfa; font-weight: 700;
        }

        /* ─── Section 2 gap ─── */
        .cr-sec-gap { margin-top: 1.5rem; }

        /* ─── Divider ─── */
        .cr-hr { height: 1px; background: #f1f5f9; margin: 1.75rem 0 1.5rem; }

        /* ─── Submit ─── */
        .cr-submit {
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
        .cr-submit:hover:not(:disabled) {
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 22px rgba(59,91,250,0.4) !important;
        }
        .cr-submit:active:not(:disabled) { transform: translateY(0) !important; }
        .cr-submit:disabled { opacity: 0.65 !important; cursor: not-allowed !important; }

        .cr-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: cr-spin 0.65s linear infinite; flex-shrink: 0;
        }
        @keyframes cr-spin { to { transform: rotate(360deg); } }

        .cr-footer-note {
          display: flex; align-items: center; justify-content: center;
          gap: 5px; margin-top: 1rem;
          font-size: 0.71rem; color: #94a3b8;
        }
        .cr-footer-note svg { color: #94a3b8; }

        @media (max-width: 560px) {
          .cr-header, .cr-body, .cr-preview-strip { padding-left: 1.5rem; padding-right: 1.5rem; }
        }
      `}</style>

      <div className="cr-wrap">
        <div className="cr-card">

          {/* ── Header ── */}
          <div className="cr-header">
            <div className="cr-header-blob1" />
            <div className="cr-header-blob2" />
            <div className="cr-header-top">
              <div className="cr-header-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2"/>
                  <path d="M8 21h8M12 17v4"/>
                </svg>
              </div>
              <div className="cr-header-badge">New Classroom</div>
            </div>
            <h1 className="cr-header-title">Add Classroom</h1>
            <p className="cr-header-sub">Create a new classroom and assign a teacher</p>
          </div>

          {/* ── Live Preview Strip ── */}
          <div className="cr-preview-strip">
            <div className="cr-preview-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <path d="M8 21h8M12 17v4"/>
              </svg>
            </div>
            <div>
              <div className="cr-preview-name">{classroomName || "Classroom Name"}</div>
              <div className="cr-preview-sub">
                {selectedTeacherName ? `Teacher: ${selectedTeacherName}` : "No teacher assigned yet"}
              </div>
            </div>
            <div className="cr-new-chip">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              New
            </div>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit}>
            <div className="cr-body">

              {/* ── Section: Classroom Details ── */}
              <div className="cr-sec">
                <div className="cr-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                  </svg>
                  <span>Classroom Details</span>
                </div>
                <div className="cr-sec-line" />
              </div>

              <div className="cr-field">
                <label className="cr-label" htmlFor="classroom_name">
                  Classroom Name <span className="cr-star">*</span>
                </label>
                <Input
                  id="classroom_name"
                  name="classroom_name"
                  placeholder="e.g. Class 10-A, CS Lab 2"
                  value={classroomName}
                  onChange={(e) => setClassroomName(e.target.value)}
                  required
                />
              </div>

              {/* ── Section: Assign Teacher ── */}
              <div className="cr-sec cr-sec-gap">
                <div className="cr-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                  <span>Assign Teacher</span>
                </div>
                <div className="cr-sec-line" />
              </div>

              <div className="cr-field">
                <div className="cr-teacher-meta">
                  <label className="cr-label" htmlFor="teacher-select">
                    Select Teacher <span className="cr-star">*</span>
                  </label>
                  <span className="cr-teacher-count">
                    <span>{teacher.length}</span> available
                  </span>
                </div>
                <Select
                  value={selectedTeacher ?? ""}
                  onValueChange={(value) => setSelectedTeacher(value)}
                >
                  <SelectTrigger id="teacher-select">
                    <SelectValue placeholder="Search and select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teacher.map((t) => (
                      <SelectItem key={t._id} value={t._id}>
                        {t.name ?? "Unnamed Teacher"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="cr-hr" />

              {/* ── Submit ── */}
              <Button type="submit" className="cr-submit" disabled={loading}>
                {loading ? (
                  <><span className="cr-spinner" /> Creating Classroom…</>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                    Create Classroom
                  </>
                )}
              </Button>

              <p className="cr-footer-note">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                All fields are required · Information is stored securely
              </p>

            </div>
          </form>

        </div>
      </div>
    </>
  );
}