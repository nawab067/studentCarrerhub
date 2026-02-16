'use client';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { teacher, classroom } from "@/app/admin/classroom/types";

export interface ClassroomEditPageProps {
  onSubmit: (data: { classroom_name: string; teacherId: string | null }) => Promise<void>;
  loading: boolean;
  teacher: teacher[];
  classroomData: classroom | null;
}

export default function ClassroomEditPage({
  onSubmit,
  loading,
  teacher,
  classroomData,
}: ClassroomEditPageProps) {
  const [classroomName, setClassroomName] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  useEffect(() => {
    if (classroomData) {
      setClassroomName(classroomData.classroom_name);
      setSelectedTeacher(classroomData.teacherId ?? null);
    }
  }, [classroomData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!classroomName.trim()) {
      alert("Please enter a classroom name.");
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

        .ce-wrap {
          min-height: 100vh;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ce-card {
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
        .ce-header {
          background: linear-gradient(135deg, #3b5bfa 0%, #5c7cfa 100%);
          padding: 2rem 2.5rem 2rem;
          position: relative;
          overflow: hidden;
        }
        .ce-header-blob1 {
          position: absolute; top: -50px; right: -50px;
          width: 180px; height: 180px;
          background: rgba(255,255,255,0.08); border-radius: 50%;
        }
        .ce-header-blob2 {
          position: absolute; bottom: -70px; right: 80px;
          width: 140px; height: 140px;
          background: rgba(255,255,255,0.05); border-radius: 50%;
        }
        .ce-header-top {
          display: flex; align-items: flex-start;
          justify-content: space-between;
          position: relative; z-index: 1;
        }
        .ce-header-icon {
          width: 50px; height: 50px;
          background: rgba(255,255,255,0.15);
          border-radius: 14px; display: flex;
          align-items: center; justify-content: center;
          backdrop-filter: blur(6px);
        }
        .ce-header-icon svg { color: #fff; }
        .ce-header-badge {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 20px; padding: 4px 12px;
          font-size: 0.7rem; font-weight: 600;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        .ce-header-title {
          font-size: 1.65rem; font-weight: 700;
          color: #fff; margin: 1rem 0 0.3rem;
          letter-spacing: -0.02em;
          position: relative; z-index: 1;
        }
        .ce-header-sub {
          font-size: 0.82rem; color: rgba(255,255,255,0.68);
          font-weight: 400; margin: 0;
          position: relative; z-index: 1;
        }

        /* ─── Preview Strip ─── */
        .ce-preview-strip {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 1rem 2.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .ce-preview-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #3b5bfa, #5c7cfa);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(59,91,250,0.25);
        }
        .ce-preview-icon svg { color: #fff; }
        .ce-preview-name {
          font-size: 0.9rem; font-weight: 700; color: #1e293b;
        }
        .ce-preview-sub {
          font-size: 0.75rem; color: #64748b; margin-top: 2px;
        }
        .ce-edit-chip {
          margin-left: auto;
          display: flex; align-items: center; gap: 5px;
          background: #eef2ff; border-radius: 20px;
          padding: 5px 12px;
          font-size: 0.72rem; font-weight: 600; color: #3b5bfa;
          flex-shrink: 0;
        }
        .ce-edit-chip svg { color: #3b5bfa; }

        /* ─── Body ─── */
        .ce-body { padding: 2rem 2.5rem 2.5rem; }

        /* ─── Section divider ─── */
        .ce-sec {
          display: flex; align-items: center;
          gap: 0.65rem; margin: 0 0 1.1rem;
        }
        .ce-sec-gap { margin-top: 1.5rem; }
        .ce-sec-pill {
          display: flex; align-items: center; gap: 6px;
          background: #eef2ff; border-radius: 20px;
          padding: 4px 12px; flex-shrink: 0;
        }
        .ce-sec-pill svg { color: #3b5bfa; }
        .ce-sec-pill span {
          font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.09em;
          color: #3b5bfa;
        }
        .ce-sec-line { flex: 1; height: 1px; background: #e2e8f0; }

        .ce-field { display: flex; flex-direction: column; gap: 0.45rem; margin-bottom: 1.25rem; }
        .ce-label {
          font-size: 0.775rem; font-weight: 600;
          color: #374151; letter-spacing: 0.01em;
          display: flex; align-items: center; gap: 3px;
        }
        .ce-star { color: #3b5bfa; font-size: 0.8rem; }

        /* ─── Input overrides ─── */
        .ce-body input[type="text"] {
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
        .ce-body input[type="text"]::placeholder {
          color: #b0bac6 !important; font-weight: 400 !important;
        }
        .ce-body input[type="text"]:focus {
          border-color: #3b5bfa !important;
          background: #fff !important;
          box-shadow: 0 0 0 3.5px rgba(59, 91, 250, 0.1) !important;
        }

        /* ─── Select overrides ─── */
        .ce-body button[role="combobox"] {
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
        .ce-body button[role="combobox"]:focus,
        .ce-body button[role="combobox"][data-state="open"] {
          border-color: #3b5bfa !important;
          background: #fff !important;
          box-shadow: 0 0 0 3.5px rgba(59, 91, 250, 0.1) !important;
          outline: none !important;
        }

        /* ─── Teacher count ─── */
        .ce-teacher-meta {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: 0.45rem;
        }
        .ce-teacher-count {
          font-size: 0.7rem; color: #94a3b8; font-weight: 500;
        }
        .ce-teacher-count span { color: #3b5bfa; font-weight: 700; }

        /* ─── Info note ─── */
        .ce-info-note {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.7rem; color: #f59e0b; font-weight: 500;
          margin-top: 6px;
        }
        .ce-info-note svg { color: #f59e0b; flex-shrink: 0; }

        /* ─── Divider ─── */
        .ce-hr { height: 1px; background: #f1f5f9; margin: 1.75rem 0 1.5rem; }

        /* ─── Submit ─── */
        .ce-submit {
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
        .ce-submit:hover:not(:disabled) {
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 22px rgba(59,91,250,0.4) !important;
        }
        .ce-submit:active:not(:disabled) { transform: translateY(0) !important; }
        .ce-submit:disabled { opacity: 0.65 !important; cursor: not-allowed !important; }

        .ce-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: ce-spin 0.65s linear infinite; flex-shrink: 0;
        }
        @keyframes ce-spin { to { transform: rotate(360deg); } }

        .ce-footer-note {
          display: flex; align-items: center; justify-content: center;
          gap: 5px; margin-top: 1rem;
          font-size: 0.71rem; color: #94a3b8;
        }
        .ce-footer-note svg { color: #94a3b8; }

        @media (max-width: 560px) {
          .ce-header, .ce-body, .ce-preview-strip { padding-left: 1.5rem; padding-right: 1.5rem; }
        }
      `}</style>

      <div className="ce-wrap">
        <div className="ce-card">

          {/* ── Header ── */}
          <div className="ce-header">
            <div className="ce-header-blob1" />
            <div className="ce-header-blob2" />
            <div className="ce-header-top">
              <div className="ce-header-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <div className="ce-header-badge">Edit Classroom</div>
            </div>
            <h1 className="ce-header-title">Edit Classroom</h1>
            <p className="ce-header-sub">Update the classroom details and assigned teacher</p>
          </div>

          {/* ── Live Preview Strip ── */}
          <div className="ce-preview-strip">
            <div className="ce-preview-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <path d="M8 21h8M12 17v4"/>
              </svg>
            </div>
            <div>
              <div className="ce-preview-name">{classroomName || "Classroom Name"}</div>
              <div className="ce-preview-sub">
                {selectedTeacherName ? `Teacher: ${selectedTeacherName}` : "No teacher assigned"}
              </div>
            </div>
            <div className="ce-edit-chip">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editing
            </div>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit}>
            <div className="ce-body">

              {/* ── Section: Classroom Details ── */}
              <div className="ce-sec">
                <div className="ce-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                  </svg>
                  <span>Classroom Details</span>
                </div>
                <div className="ce-sec-line" />
              </div>

              <div className="ce-field">
                <label className="ce-label" htmlFor="classroom_name">
                  Classroom Name <span className="ce-star">*</span>
                </label>
                <Input
                  id="classroom_name"
                  placeholder="e.g. Class 10-A, CS Lab 2"
                  value={classroomName}
                  onChange={(e) => setClassroomName(e.target.value)}
                  required
                />
              </div>

              {/* ── Section: Assign Teacher ── */}
              <div className="ce-sec ce-sec-gap">
                <div className="ce-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                  <span>Assign Teacher</span>
                </div>
                <div className="ce-sec-line" />
              </div>

              <div className="ce-field">
                <div className="ce-teacher-meta">
                  <label className="ce-label">
                    Select Teacher
                  </label>
                  <span className="ce-teacher-count">
                    <span>{teacher.length}</span> available
                  </span>
                </div>
                <Select
                  value={selectedTeacher ?? ""}
                  onValueChange={(value) => setSelectedTeacher(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teacher.map((t) => (
                      <SelectItem key={t._id} value={t._id}>
                        {t.name ?? "Unnamed Teacher"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="ce-info-note">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Leave unchanged to keep the current teacher
                </p>
              </div>

              <div className="ce-hr" />

              {/* ── Submit ── */}
              <Button type="submit" className="ce-submit" disabled={loading}>
                {loading ? (
                  <><span className="ce-spinner" /> Saving Changes…</>
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

              <p className="ce-footer-note">
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