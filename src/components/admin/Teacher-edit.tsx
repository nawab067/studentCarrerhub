import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { Teacher } from "@/app/admin/teachers/addteacher/page";

interface TeacherEditPageProps {
  teacherData: Teacher | null;
  editTeacher: (teacher: Teacher) => Promise<void>;
  loading: boolean;
}

export default function TeacherEditPage({ teacherData, editTeacher, loading }: TeacherEditPageProps) {
  if (!teacherData) {
    return <p className="text-center p-6">Loading teacher data...</p>;
  }

  const [name, setName] = useState(teacherData?.name || "");
  const [email, setEmail] = useState(teacherData?.email || "");
  const [designation, setDesignation] = useState(teacherData?.Teacher_Designation || "");
  const [professionality, setProfessionality] = useState(teacherData?.Teacher_Professionality || "");
  const [phone, setPhone] = useState(teacherData?.Teacher_Phone_Number || "");
  const [status, setStatus] = useState(teacherData?.status || "active");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedTeacher: Teacher = {
      ...teacherData,
      name,
      email,
      Teacher_Designation: designation,
      Teacher_Professionality: professionality,
      Teacher_Phone_Number: phone,
      status,
      image,
    };
    await editTeacher(updatedTeacher);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        .et-wrap {
          min-height: 100vh;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .et-card {
          width: 100%;
          max-width: 620px;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow:
            0 1px 3px rgba(0,0,0,0.04),
            0 10px 30px rgba(0,0,0,0.07);
          overflow: hidden;
        }

        /* ─── Header ─── */
        .et-header {
          background: linear-gradient(135deg, #3b5bfa 0%, #5c7cfa 100%);
          padding: 2rem 2.5rem 2rem;
          position: relative;
          overflow: hidden;
        }
        .et-header-blob1 {
          position: absolute; top: -50px; right: -50px;
          width: 180px; height: 180px;
          background: rgba(255,255,255,0.08); border-radius: 50%;
        }
        .et-header-blob2 {
          position: absolute; bottom: -70px; right: 80px;
          width: 140px; height: 140px;
          background: rgba(255,255,255,0.05); border-radius: 50%;
        }
        .et-header-top {
          display: flex; align-items: flex-start;
          justify-content: space-between;
          position: relative; z-index: 1;
        }
        .et-header-icon {
          width: 50px; height: 50px;
          background: rgba(255,255,255,0.15);
          border-radius: 14px; display: flex;
          align-items: center; justify-content: center;
          backdrop-filter: blur(6px);
        }
        .et-header-icon svg { color: #fff; }
        .et-header-badge {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 20px; padding: 4px 12px;
          font-size: 0.7rem; font-weight: 600;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        .et-header-title {
          font-size: 1.65rem; font-weight: 700;
          color: #fff; margin: 1rem 0 0.3rem;
          letter-spacing: -0.02em;
          position: relative; z-index: 1;
        }
        .et-header-sub {
          font-size: 0.82rem; color: rgba(255,255,255,0.68);
          font-weight: 400; margin: 0;
          position: relative; z-index: 1;
        }

        /* ─── Avatar strip ─── */
        .et-avatar-strip {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 1rem 2.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .et-avatar {
          width: 48px; height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b5bfa, #5c7cfa);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; font-weight: 700; color: #fff;
          flex-shrink: 0;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(59,91,250,0.25);
        }
        .et-avatar-name {
          font-size: 0.9rem; font-weight: 700; color: #1e293b;
        }
        .et-avatar-sub {
          font-size: 0.75rem; color: #64748b; margin-top: 2px;
        }
        .et-edit-chip {
          margin-left: auto;
          display: flex; align-items: center; gap: 5px;
          background: #eef2ff; border-radius: 20px;
          padding: 5px 12px;
          font-size: 0.72rem; font-weight: 600; color: #3b5bfa;
        }
        .et-edit-chip svg { color: #3b5bfa; }

        /* ─── Body ─── */
        .et-body { padding: 2rem 2.5rem 2.5rem; }

        /* ─── Section divider ─── */
        .et-sec {
          display: flex; align-items: center;
          gap: 0.65rem; margin: 1.5rem 0 1.1rem;
        }
        .et-sec:first-child { margin-top: 0; }
        .et-sec-pill {
          display: flex; align-items: center; gap: 6px;
          background: #eef2ff; border-radius: 20px;
          padding: 4px 12px; flex-shrink: 0;
        }
        .et-sec-pill svg { color: #3b5bfa; }
        .et-sec-pill span {
          font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.09em;
          color: #3b5bfa;
        }
        .et-sec-line { flex: 1; height: 1px; background: #e2e8f0; }

        /* ─── Grid ─── */
        .et-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
        .et-field { display: flex; flex-direction: column; gap: 0.45rem; margin-bottom: 1rem; }

        .et-label {
          font-size: 0.775rem; font-weight: 600;
          color: #374151; letter-spacing: 0.01em;
          display: flex; align-items: center; gap: 3px;
        }
        .et-star { color: #3b5bfa; font-size: 0.8rem; }

        /* ─── Input overrides ─── */
        .et-body input[type="text"],
        .et-body input[type="email"],
        .et-body input[type="tel"] {
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
        .et-body input[type="text"]::placeholder,
        .et-body input[type="email"]::placeholder,
        .et-body input[type="tel"]::placeholder {
          color: #b0bac6 !important; font-weight: 400 !important;
        }
        .et-body input[type="text"]:focus,
        .et-body input[type="email"]:focus,
        .et-body input[type="tel"]:focus {
          border-color: #3b5bfa !important;
          background: #fff !important;
          box-shadow: 0 0 0 3.5px rgba(59, 91, 250, 0.1) !important;
        }

        /* ─── Select ─── */
        .et-body button[role="combobox"] {
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
        .et-body button[role="combobox"]:focus,
        .et-body button[role="combobox"][data-state="open"] {
          border-color: #3b5bfa !important;
          background: #fff !important;
          box-shadow: 0 0 0 3.5px rgba(59, 91, 250, 0.1) !important;
          outline: none !important;
        }

        /* ─── Status badges ─── */
        .et-badges { display: flex; gap: 6px; margin-top: 6px; }
        .et-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 9px; border-radius: 20px;
          font-size: 0.68rem; font-weight: 600;
        }
        .et-badge-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .badge-green { background: #dcfce7; color: #15803d; }
        .badge-red   { background: #fee2e2; color: #b91c1c; }

        /* ─── File upload ─── */
        .et-file-wrap { position: relative; }
        .et-body input[type="file"] {
          position: absolute; inset: 0; opacity: 0;
          cursor: pointer; width: 100%; height: 100%; z-index: 2;
        }
        .et-file-box {
          display: flex; align-items: center; gap: 0.9rem;
          background: #f8fafc;
          border: 1.5px dashed #c7d2fe;
          border-radius: 10px; padding: 0.8rem 1rem;
          cursor: pointer; transition: border-color 0.18s, background 0.18s;
        }
        .et-file-box:hover { border-color: #3b5bfa; background: #eef2ff; }
        .et-file-icon {
          width: 40px; height: 40px;
          background: #eef2ff; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .et-file-icon svg { color: #3b5bfa; }
        .et-file-main { font-size: 0.82rem; color: #3b5bfa; font-weight: 600; }
        .et-file-sub  { font-size: 0.7rem; color: #94a3b8; margin-top: 2px; }
        .et-file-note {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.7rem; color: #f59e0b; font-weight: 500;
          margin-top: 6px;
        }
        .et-file-note svg { color: #f59e0b; flex-shrink: 0; }

        /* ─── Divider ─── */
        .et-hr { height: 1px; background: #f1f5f9; margin: 1.75rem 0 1.5rem; }

        /* ─── Submit ─── */
        .et-submit {
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
        .et-submit:hover:not(:disabled) {
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 22px rgba(59,91,250,0.4) !important;
        }
        .et-submit:active:not(:disabled) { transform: translateY(0) !important; }
        .et-submit:disabled { opacity: 0.65 !important; cursor: not-allowed !important; }

        .et-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: et-spin 0.65s linear infinite; flex-shrink: 0;
        }
        @keyframes et-spin { to { transform: rotate(360deg); } }

        .et-footer-note {
          display: flex; align-items: center; justify-content: center;
          gap: 5px; margin-top: 1rem;
          font-size: 0.71rem; color: #94a3b8;
        }
        .et-footer-note svg { color: #94a3b8; }

        @media (max-width: 540px) {
          .et-row { grid-template-columns: 1fr; }
          .et-header, .et-body, .et-avatar-strip { padding-left: 1.5rem; padding-right: 1.5rem; }
        }
      `}</style>

      <div className="et-wrap">
        <div className="et-card">

          {/* ── Header ── */}
          <div className="et-header">
            <div className="et-header-blob1" />
            <div className="et-header-blob2" />
            <div className="et-header-top">
              <div className="et-header-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <div className="et-header-badge">Edit Faculty</div>
            </div>
            <h1 className="et-header-title">Edit Teacher</h1>
            <p className="et-header-sub">Update the faculty member's information below</p>
          </div>

          {/* ── Avatar Strip ── */}
          <div className="et-avatar-strip">
            <div className="et-avatar">
              {name ? name.charAt(0).toUpperCase() : "T"}
            </div>
            <div>
              <div className="et-avatar-name">{name || "Teacher Name"}</div>
              <div className="et-avatar-sub">{designation || "No designation set"}</div>
            </div>
            <div className="et-edit-chip">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editing
            </div>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit}>
            <div className="et-body">

              {/* ── Section: Personal ── */}
              <div className="et-sec">
                <div className="et-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                  <span>Personal Info</span>
                </div>
                <div className="et-sec-line" />
              </div>

              <div className="et-row">
                <div className="et-field">
                  <label className="et-label" htmlFor="name">Full Name <span className="et-star">*</span></label>
                  <Input
                    id="name" name="name"
                    placeholder="e.g. Sarah Johnson"
                    required value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="et-field">
                  <label className="et-label" htmlFor="phone">Phone Number <span className="et-star">*</span></label>
                  <Input
                    id="phone" name="phone" type="tel"
                    placeholder="+92 300 0000000"
                    required value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="et-field">
                <label className="et-label" htmlFor="email">Email Address <span className="et-star">*</span></label>
                <Input
                  id="email" name="email" type="email"
                  placeholder="teacher@school.edu.pk"
                  required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* ── Section: Professional ── */}
              <div className="et-sec">
                <div className="et-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  </svg>
                  <span>Professional Info</span>
                </div>
                <div className="et-sec-line" />
              </div>

              <div className="et-row">
                <div className="et-field">
                  <label className="et-label" htmlFor="designation">Designation <span className="et-star">*</span></label>
                  <Input
                    id="designation" name="designation"
                    placeholder="e.g. Senior Lecturer"
                    required value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                  />
                </div>
                <div className="et-field">
                  <label className="et-label" htmlFor="status">Status <span className="et-star">*</span></label>
                  <Select name="status" value={status} onValueChange={(val) => setStatus(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">
                        <span style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <span style={{ width:7, height:7, borderRadius:'50%', background:'#16a34a', display:'inline-block' }}/>
                          Active
                        </span>
                      </SelectItem>
                      <SelectItem value="inactive">
                        <span style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <span style={{ width:7, height:7, borderRadius:'50%', background:'#dc2626', display:'inline-block' }}/>
                          Inactive
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="et-badges">
                    <span className="et-badge badge-green"><span className="et-badge-dot" style={{ background:'#16a34a' }}/>Active</span>
                    <span className="et-badge badge-red"><span className="et-badge-dot" style={{ background:'#dc2626' }}/>Inactive</span>
                  </div>
                </div>
              </div>

              <div className="et-field">
                <label className="et-label" htmlFor="professionality">Area of Expertise <span className="et-star">*</span></label>
                <Input
                  id="professionality" name="professionality"
                  placeholder="e.g. Mathematics, Physics, Computer Science"
                  required value={professionality}
                  onChange={(e) => setProfessionality(e.target.value)}
                />
              </div>

              {/* ── Section: Photo ── */}
              <div className="et-sec">
                <div className="et-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>Profile Photo</span>
                </div>
                <div className="et-sec-line" />
              </div>

              <div className="et-field">
                <label className="et-label" htmlFor="image">Upload New Image</label>
                <div className="et-file-wrap">
                  <Input
                    id="image" name="image" type="file" accept="image/*"
                    onChange={(e) => setImage(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                  />
                  <div className="et-file-box">
                    <div className="et-file-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <div>
                      <div className="et-file-main">Click to browse or drag & drop</div>
                      <div className="et-file-sub">PNG, JPG, WEBP supported · Max 5 MB</div>
                    </div>
                  </div>
                  <p className="et-file-note">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    Leave empty to keep the existing photo
                  </p>
                </div>
              </div>

              <div className="et-hr" />

              {/* ── Submit ── */}
              <Button type="submit" className="et-submit" disabled={loading}>
                {loading ? (
                  <><span className="et-spinner" /> Updating Teacher…</>
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

              <p className="et-footer-note">
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