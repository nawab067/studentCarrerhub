import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export interface courseAddPageProps {
  onSubmit: (courseData: {
    course_name: string;
    course_code: string;
    description: string;
    subjectId: string;
    teacherId: string;
  }) => Promise<void>;
  loading: boolean;
  subject: { id: string; name: string }[];
  teacher: { id: string; name: string }[];
}

export default function CourseAddPage({ onSubmit, loading, subject, teacher }: courseAddPageProps) {
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>();
  const [selectedTeacher, setSelectedTeacher] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedSubject || !selectedTeacher) {
      alert("Please select both a subject and a teacher.");
      return;
    }

    const formData = new FormData(e.currentTarget);

    const payload = {
      course_name: formData.get("course_name") as string,
      course_code: formData.get("course_code") as string,
      description: formData.get("description") as string,
      subjectId: selectedSubject,
      teacherId: selectedTeacher,
    };

    await onSubmit(payload);
  };

  const selectedTeacherName = teacher.find((t) => t.id === selectedTeacher)?.name;
  const selectedSubjectName = subject.find((s) => s.id === selectedSubject)?.name;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        .ca-wrap {
          min-height: 100vh;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ca-card {
          width: 100%;
          max-width: 580px;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow:
            0 1px 3px rgba(0,0,0,0.04),
            0 10px 30px rgba(0,0,0,0.07);
          overflow: hidden;
        }

        /* ─── Header ─── */
        .ca-header {
          background: linear-gradient(135deg, #3b5bfa 0%, #5c7cfa 100%);
          padding: 2rem 2.5rem 2rem;
          position: relative;
          overflow: hidden;
        }
        .ca-blob1 {
          position: absolute; top: -50px; right: -50px;
          width: 180px; height: 180px;
          background: rgba(255,255,255,0.08); border-radius: 50%;
        }
        .ca-blob2 {
          position: absolute; bottom: -70px; right: 80px;
          width: 140px; height: 140px;
          background: rgba(255,255,255,0.05); border-radius: 50%;
        }
        .ca-header-top {
          display: flex; align-items: flex-start;
          justify-content: space-between;
          position: relative; z-index: 1;
        }
        .ca-header-icon {
          width: 50px; height: 50px;
          background: rgba(255,255,255,0.15);
          border-radius: 14px; display: flex;
          align-items: center; justify-content: center;
          backdrop-filter: blur(6px);
        }
        .ca-header-icon svg { color: #fff; }
        .ca-badge {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 20px; padding: 4px 12px;
          font-size: 0.7rem; font-weight: 600;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        .ca-header-title {
          font-size: 1.65rem; font-weight: 700;
          color: #fff; margin: 1rem 0 0.3rem;
          letter-spacing: -0.02em;
          position: relative; z-index: 1;
        }
        .ca-header-sub {
          font-size: 0.82rem; color: rgba(255,255,255,0.68);
          font-weight: 400; margin: 0;
          position: relative; z-index: 1;
        }

        /* ─── Preview Strip ─── */
        .ca-strip {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 1rem 2.5rem;
          display: flex; align-items: center; gap: 1rem;
        }
        .ca-strip-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, #3b5bfa, #5c7cfa);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(59,91,250,0.25);
        }
        .ca-strip-icon svg { color: #fff; }
        .ca-strip-name {
          font-size: 0.9rem; font-weight: 700; color: #1e293b;
        }
        .ca-strip-sub {
          font-size: 0.75rem; color: #64748b; margin-top: 2px;
        }
        .ca-new-chip {
          margin-left: auto;
          display: flex; align-items: center; gap: 5px;
          background: #eef2ff; border-radius: 20px;
          padding: 5px 12px;
          font-size: 0.72rem; font-weight: 600; color: #3b5bfa;
          flex-shrink: 0;
        }

        /* ─── Body ─── */
        .ca-body { padding: 2rem 2.5rem 2.5rem; }

        /* ─── Section ─── */
        .ca-sec {
          display: flex; align-items: center;
          gap: 0.65rem; margin: 0 0 1.1rem;
        }
        .ca-sec-gap { margin-top: 1.5rem; }
        .ca-sec-pill {
          display: flex; align-items: center; gap: 6px;
          background: #eef2ff; border-radius: 20px;
          padding: 4px 12px; flex-shrink: 0;
        }
        .ca-sec-pill svg { color: #3b5bfa; }
        .ca-sec-pill span {
          font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.09em; color: #3b5bfa;
        }
        .ca-sec-line { flex: 1; height: 1px; background: #e2e8f0; }

        /* ─── Grid & fields ─── */
        .ca-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
        .ca-field { display: flex; flex-direction: column; gap: 0.45rem; margin-bottom: 1.1rem; }
        .ca-label {
          font-size: 0.775rem; font-weight: 600;
          color: #374151; letter-spacing: 0.01em;
          display: flex; align-items: center; gap: 3px;
        }
        .ca-star { color: #3b5bfa; font-size: 0.8rem; }

        /* ─── Code prefix ─── */
        .ca-code-wrap { position: relative; }
        .ca-code-prefix {
          position: absolute; left: 0.85rem; top: 50%;
          transform: translateY(-50%);
          font-size: 0.75rem; font-weight: 700;
          color: #3b5bfa; pointer-events: none; z-index: 1;
          letter-spacing: 0.04em;
        }
        .ca-code-wrap input { padding-left: 3rem !important; }

        /* ─── Inputs ─── */
        .ca-body input[type="text"] {
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
        .ca-body input[type="text"]::placeholder {
          color: #b0bac6 !important; font-weight: 400 !important;
        }
        .ca-body input[type="text"]:focus {
          border-color: #3b5bfa !important;
          background: #fff !important;
          box-shadow: 0 0 0 3.5px rgba(59, 91, 250, 0.1) !important;
        }

        /* ─── Textarea ─── */
        .ca-textarea {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          color: #1e293b;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.875rem;
          padding: 0.75rem 0.85rem;
          box-shadow: none;
          outline: none;
          resize: none;
          transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
          width: 100%;
          min-height: 90px;
          line-height: 1.55;
        }
        .ca-textarea::placeholder { color: #b0bac6; font-weight: 400; }
        .ca-textarea:focus {
          border-color: #3b5bfa;
          background: #fff;
          box-shadow: 0 0 0 3.5px rgba(59, 91, 250, 0.1);
        }

        /* ─── Select ─── */
        .ca-body button[role="combobox"] {
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
        .ca-body button[role="combobox"]:focus,
        .ca-body button[role="combobox"][data-state="open"] {
          border-color: #3b5bfa !important;
          background: #fff !important;
          box-shadow: 0 0 0 3.5px rgba(59, 91, 250, 0.1) !important;
          outline: none !important;
        }

        /* ─── Count meta ─── */
        .ca-meta {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: 0.45rem;
        }
        .ca-count {
          font-size: 0.7rem; color: #94a3b8; font-weight: 500;
        }
        .ca-count span { color: #3b5bfa; font-weight: 700; }

        /* ─── Divider ─── */
        .ca-hr { height: 1px; background: #f1f5f9; margin: 1.75rem 0 1.5rem; }

        /* ─── Submit ─── */
        .ca-submit {
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
        .ca-submit:hover:not(:disabled) {
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 22px rgba(59,91,250,0.4) !important;
        }
        .ca-submit:active:not(:disabled) { transform: translateY(0) !important; }
        .ca-submit:disabled { opacity: 0.65 !important; cursor: not-allowed !important; }

        .ca-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: ca-spin 0.65s linear infinite; flex-shrink: 0;
        }
        @keyframes ca-spin { to { transform: rotate(360deg); } }

        .ca-footer-note {
          display: flex; align-items: center; justify-content: center;
          gap: 5px; margin-top: 1rem;
          font-size: 0.71rem; color: #94a3b8;
        }
        .ca-footer-note svg { color: #94a3b8; }

        @media (max-width: 560px) {
          .ca-row { grid-template-columns: 1fr; }
          .ca-header, .ca-body, .ca-strip { padding-left: 1.5rem; padding-right: 1.5rem; }
        }
      `}</style>

      <div className="ca-wrap">
        <div className="ca-card">

          {/* ── Header ── */}
          <div className="ca-header">
            <div className="ca-blob1" />
            <div className="ca-blob2" />
            <div className="ca-header-top">
              <div className="ca-header-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div className="ca-badge">New Course</div>
            </div>
            <h1 className="ca-header-title">Add Course</h1>
            <p className="ca-header-sub">Create a new course and assign subject & teacher</p>
          </div>

          {/* ── Preview Strip ── */}
          <div className="ca-strip">
            <div className="ca-strip-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <div>
              <div className="ca-strip-name" id="ca-live-name">Course Name</div>
              <div className="ca-strip-sub">
                {selectedSubjectName ? `Subject: ${selectedSubjectName}` : "No subject selected"}&nbsp;·&nbsp;
                {selectedTeacherName ? `Teacher: ${selectedTeacherName}` : "No teacher selected"}
              </div>
            </div>
            <div className="ca-new-chip">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              New
            </div>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit}>
            <div className="ca-body">

              {/* ── Section: Course Details ── */}
              <div className="ca-sec">
                <div className="ca-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                  <span>Course Details</span>
                </div>
                <div className="ca-sec-line" />
              </div>

              <div className="ca-row">
                <div className="ca-field">
                  <label className="ca-label" htmlFor="course_name">
                    Course Name <span className="ca-star">*</span>
                  </label>
                  <Input
                    id="course_name"
                    name="course_name"
                    placeholder="e.g. Intro to Algebra"
                    required
                    onChange={(e) => {
                      const el = document.getElementById("ca-live-name");
                      if (el) el.textContent = e.target.value || "Course Name";
                    }}
                  />
                </div>

                <div className="ca-field">
                  <label className="ca-label" htmlFor="course_code">
                    Course Code <span className="ca-star">*</span>
                  </label>
                  <div className="ca-code-wrap">
                    <span className="ca-code-prefix">CODE</span>
                    <Input
                      id="course_code"
                      name="course_code"
                      type="text"
                      placeholder="e.g. MTH101"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* ── Section: Description ── */}
              <div className="ca-sec ca-sec-gap">
                <div className="ca-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="17" y1="10" x2="3" y2="10"/>
                    <line x1="21" y1="6" x2="3" y2="6"/>
                    <line x1="21" y1="14" x2="3" y2="14"/>
                    <line x1="17" y1="18" x2="3" y2="18"/>
                  </svg>
                  <span>Description</span>
                </div>
                <div className="ca-sec-line" />
              </div>

              <div className="ca-field">
                <label className="ca-label" htmlFor="description">
                  Course Description <span className="ca-star">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter a brief description of this course, its objectives and key topics covered…"
                  required
                  className="ca-textarea"
                  rows={3}
                />
              </div>

              {/* ── Section: Assignments ── */}
              <div className="ca-sec ca-sec-gap">
                <div className="ca-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span>Assignments</span>
                </div>
                <div className="ca-sec-line" />
              </div>

              <div className="ca-row">
                <div className="ca-field">
                  <div className="ca-meta">
                    <label className="ca-label">Subject <span className="ca-star">*</span></label>
                    <span className="ca-count"><span>{subject.length}</span> available</span>
                  </div>
                  <Select value={selectedSubject ?? ""} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subject.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="ca-field">
                  <div className="ca-meta">
                    <label className="ca-label">Teacher <span className="ca-star">*</span></label>
                    <span className="ca-count"><span>{teacher.length}</span> available</span>
                  </div>
                  <Select value={selectedTeacher ?? ""} onValueChange={setSelectedTeacher}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teacher.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="ca-hr" />

              {/* ── Submit ── */}
              <Button type="submit" className="ca-submit" disabled={loading}>
                {loading ? (
                  <><span className="ca-spinner" /> Adding Course…</>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="16"/>
                      <line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                    Add Course
                  </>
                )}
              </Button>

              <p className="ca-footer-note">
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