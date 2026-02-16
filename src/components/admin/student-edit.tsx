// File: src/components/admin/student-edit.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Student } from "@/app/admin/students/addStudent/page";

interface StudentEditPageProps {
  studentData: Student | null;
  editStudent: (student: Student) => Promise<void>;
  loading: boolean;
}

export default function StudentEditPage({ studentData, editStudent, loading }: StudentEditPageProps) {
  if (!studentData) {
    return <p className="text-center p-6">Loading student data...</p>;
  }

  const [name, setName] = useState(studentData.name);
  const [email, setEmail] = useState(studentData.email);
  const [state, setState] = useState(studentData.state);
  const [city, setCity] = useState(studentData.city);
  const [address, setAddress] = useState(studentData.address);
  const [DOB, setDOB] = useState(studentData.date_of_birth);
  const [phone, setPhone] = useState(studentData.phone_number);
  const [Roll, setRollnumber] = useState(studentData.Roll_Number);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedStudent: Student = {
      ...studentData,
      name,
      email,
      state,
      city,
      address,
      date_of_birth: DOB,
      phone_number: phone,
      Roll_Number: Roll,
      image_url: image ?? studentData.image_url,
    };

    await editStudent(updatedStudent);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        .se-wrap {
          min-height: 100vh;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .se-card {
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
        .se-header {
          background: linear-gradient(135deg, #3b5bfa 0%, #5c7cfa 100%);
          padding: 2rem 2.5rem 2rem;
          position: relative;
          overflow: hidden;
        }
        .se-header-blob1 {
          position: absolute; top: -50px; right: -50px;
          width: 180px; height: 180px;
          background: rgba(255,255,255,0.08); border-radius: 50%;
        }
        .se-header-blob2 {
          position: absolute; bottom: -70px; right: 80px;
          width: 140px; height: 140px;
          background: rgba(255,255,255,0.05); border-radius: 50%;
        }
        .se-header-top {
          display: flex; align-items: flex-start;
          justify-content: space-between;
          position: relative; z-index: 1;
        }
        .se-header-icon {
          width: 50px; height: 50px;
          background: rgba(255,255,255,0.15);
          border-radius: 14px; display: flex;
          align-items: center; justify-content: center;
          backdrop-filter: blur(6px);
        }
        .se-header-icon svg { color: #fff; }
        .se-header-badge {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 20px; padding: 4px 12px;
          font-size: 0.7rem; font-weight: 600;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        .se-header-title {
          font-size: 1.65rem; font-weight: 700;
          color: #fff; margin: 1rem 0 0.3rem;
          letter-spacing: -0.02em;
          position: relative; z-index: 1;
        }
        .se-header-sub {
          font-size: 0.82rem; color: rgba(255,255,255,0.68);
          font-weight: 400; margin: 0;
          position: relative; z-index: 1;
        }

        /* ─── Avatar Strip ─── */
        .se-avatar-strip {
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          padding: 1rem 2.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .se-avatar {
          width: 48px; height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b5bfa, #5c7cfa);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; font-weight: 700; color: #fff;
          flex-shrink: 0;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(59,91,250,0.25);
        }
        .se-avatar-name {
          font-size: 0.9rem; font-weight: 700; color: #1e293b;
        }
        .se-avatar-sub {
          font-size: 0.75rem; color: #64748b; margin-top: 2px;
        }
        .se-edit-chip {
          margin-left: auto;
          display: flex; align-items: center; gap: 5px;
          background: #eef2ff; border-radius: 20px;
          padding: 5px 12px;
          font-size: 0.72rem; font-weight: 600; color: #3b5bfa;
          flex-shrink: 0;
        }
        .se-edit-chip svg { color: #3b5bfa; }

        /* ─── Body ─── */
        .se-body { padding: 2rem 2.5rem 2.5rem; }

        /* ─── Section divider ─── */
        .se-sec {
          display: flex; align-items: center;
          gap: 0.65rem; margin: 1.5rem 0 1.1rem;
        }
        .se-sec:first-child { margin-top: 0; }
        .se-sec-pill {
          display: flex; align-items: center; gap: 6px;
          background: #eef2ff; border-radius: 20px;
          padding: 4px 12px; flex-shrink: 0;
        }
        .se-sec-pill svg { color: #3b5bfa; }
        .se-sec-pill span {
          font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.09em;
          color: #3b5bfa;
        }
        .se-sec-line { flex: 1; height: 1px; background: #e2e8f0; }

        /* ─── Grid ─── */
        .se-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
        .se-field { display: flex; flex-direction: column; gap: 0.45rem; margin-bottom: 1rem; }

        .se-label {
          font-size: 0.775rem; font-weight: 600;
          color: #374151; letter-spacing: 0.01em;
          display: flex; align-items: center; gap: 3px;
        }
        .se-star { color: #3b5bfa; font-size: 0.8rem; }

        /* ─── Input overrides ─── */
        .se-body input[type="text"],
        .se-body input[type="email"],
        .se-body input[type="tel"],
        .se-body input[type="date"] {
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
        .se-body input[type="text"]::placeholder,
        .se-body input[type="email"]::placeholder,
        .se-body input[type="tel"]::placeholder {
          color: #b0bac6 !important; font-weight: 400 !important;
        }
        .se-body input[type="date"] { color: #64748b !important; }
        .se-body input[type="text"]:focus,
        .se-body input[type="email"]:focus,
        .se-body input[type="tel"]:focus,
        .se-body input[type="date"]:focus {
          border-color: #3b5bfa !important;
          background: #fff !important;
          box-shadow: 0 0 0 3.5px rgba(59, 91, 250, 0.1) !important;
        }

        /* ─── Roll number prefix ─── */
        .se-roll-wrap { position: relative; }
        .se-roll-prefix {
          position: absolute; left: 0.85rem; top: 50%;
          transform: translateY(-50%);
          font-size: 0.78rem; font-weight: 700;
          color: #3b5bfa; pointer-events: none; z-index: 1;
        }
        .se-roll-wrap input { padding-left: 2.5rem !important; }

        /* ─── File upload ─── */
        .se-file-wrap { position: relative; }
        .se-body input[type="file"] {
          position: absolute; inset: 0; opacity: 0;
          cursor: pointer; width: 100%; height: 100%; z-index: 2;
        }
        .se-file-box {
          display: flex; align-items: center; gap: 0.9rem;
          background: #f8fafc;
          border: 1.5px dashed #c7d2fe;
          border-radius: 10px; padding: 0.8rem 1rem;
          cursor: pointer; transition: border-color 0.18s, background 0.18s;
        }
        .se-file-box:hover { border-color: #3b5bfa; background: #eef2ff; }
        .se-file-icon {
          width: 40px; height: 40px;
          background: #eef2ff; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .se-file-icon svg { color: #3b5bfa; }
        .se-file-main { font-size: 0.82rem; color: #3b5bfa; font-weight: 600; }
        .se-file-sub  { font-size: 0.7rem; color: #94a3b8; margin-top: 2px; }
        .se-file-note {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.7rem; color: #f59e0b; font-weight: 500;
          margin-top: 6px;
        }
        .se-file-note svg { color: #f59e0b; flex-shrink: 0; }

        /* ─── Divider ─── */
        .se-hr { height: 1px; background: #f1f5f9; margin: 1.75rem 0 1.5rem; }

        /* ─── Submit ─── */
        .se-submit {
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
        .se-submit:hover:not(:disabled) {
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 22px rgba(59,91,250,0.4) !important;
        }
        .se-submit:active:not(:disabled) { transform: translateY(0) !important; }
        .se-submit:disabled { opacity: 0.65 !important; cursor: not-allowed !important; }

        .se-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: se-spin 0.65s linear infinite; flex-shrink: 0;
        }
        @keyframes se-spin { to { transform: rotate(360deg); } }

        .se-footer-note {
          display: flex; align-items: center; justify-content: center;
          gap: 5px; margin-top: 1rem;
          font-size: 0.71rem; color: #94a3b8;
        }
        .se-footer-note svg { color: #94a3b8; }

        @media (max-width: 560px) {
          .se-row { grid-template-columns: 1fr; }
          .se-header, .se-body, .se-avatar-strip { padding-left: 1.5rem; padding-right: 1.5rem; }
        }
      `}</style>

      <div className="se-wrap">
        <div className="se-card">

          {/* ── Header ── */}
          <div className="se-header">
            <div className="se-header-blob1" />
            <div className="se-header-blob2" />
            <div className="se-header-top">
              <div className="se-header-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <div className="se-header-badge">Edit Student</div>
            </div>
            <h1 className="se-header-title">Edit Student</h1>
            <p className="se-header-sub">Update the student's information below</p>
          </div>

          {/* ── Avatar Strip ── */}
          <div className="se-avatar-strip">
            <div className="se-avatar">
              {name ? name.charAt(0).toUpperCase() : "S"}
            </div>
            <div>
              <div className="se-avatar-name">{name || "Student Name"}</div>
              <div className="se-avatar-sub">Roll No: {Roll || "Not set"} · {city || "No city set"}</div>
            </div>
            <div className="se-edit-chip">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              Editing
            </div>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit}>
            <div className="se-body">

              {/* ── Section: Personal ── */}
              <div className="se-sec">
                <div className="se-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                  <span>Personal Info</span>
                </div>
                <div className="se-sec-line" />
              </div>

              <div className="se-row">
                <div className="se-field">
                  <label className="se-label" htmlFor="name">Full Name <span className="se-star">*</span></label>
                  <Input
                    id="name" name="name"
                    placeholder="e.g. Ahmed Khan"
                    required value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="se-field">
                  <label className="se-label" htmlFor="date_of_birth">Date of Birth <span className="se-star">*</span></label>
                  <Input
                    id="date_of_birth" name="date_of_birth"
                    type="date" required value={DOB}
                    onChange={(e) => setDOB(e.target.value)}
                  />
                </div>
              </div>

              <div className="se-row">
                <div className="se-field">
                  <label className="se-label" htmlFor="email">Email Address <span className="se-star">*</span></label>
                  <Input
                    id="email" name="email" type="email"
                    placeholder="student@school.edu.pk"
                    required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="se-field">
                  <label className="se-label" htmlFor="phone_number">Phone Number <span className="se-star">*</span></label>
                  <Input
                    id="phone_number" name="phone_number" type="tel"
                    placeholder="+92 300 0000000"
                    required value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* ── Section: Academic ── */}
              <div className="se-sec">
                <div className="se-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                  </svg>
                  <span>Academic Info</span>
                </div>
                <div className="se-sec-line" />
              </div>

              <div className="se-field">
                <label className="se-label" htmlFor="Roll_number">Roll Number <span className="se-star">*</span></label>
                <div className="se-roll-wrap">
                  <span className="se-roll-prefix">#</span>
                  <Input
                    id="Roll_number" name="Roll_number"
                    placeholder="e.g. 2024-CS-001"
                    required value={Roll}
                    onChange={(e) => setRollnumber(e.target.value)}
                  />
                </div>
              </div>

              {/* ── Section: Location ── */}
              <div className="se-sec">
                <div className="se-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>Location</span>
                </div>
                <div className="se-sec-line" />
              </div>

              <div className="se-row">
                <div className="se-field">
                  <label className="se-label" htmlFor="state">State <span className="se-star">*</span></label>
                  <Input
                    id="state" name="state"
                    placeholder="e.g. Punjab"
                    required value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
                <div className="se-field">
                  <label className="se-label" htmlFor="city">City <span className="se-star">*</span></label>
                  <Input
                    id="city" name="city"
                    placeholder="e.g. Lahore"
                    required value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>

              <div className="se-field">
                <label className="se-label" htmlFor="address">Full Address <span className="se-star">*</span></label>
                <Input
                  id="address" name="address"
                  placeholder="e.g. House 12, Street 4, DHA Phase 5"
                  required value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* ── Section: Photo ── */}
              <div className="se-sec">
                <div className="se-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>Profile Photo</span>
                </div>
                <div className="se-sec-line" />
              </div>

              <div className="se-field">
                <label className="se-label" htmlFor="image_url">Upload New Image</label>
                <div className="se-file-wrap">
                  <Input
                    id="image_url" name="image_url"
                    type="file" accept="image/*"
                    onChange={(e) => setImage(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                  />
                  <div className="se-file-box">
                    <div className="se-file-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <div>
                      <div className="se-file-main">Click to browse or drag & drop</div>
                      <div className="se-file-sub">PNG, JPG, WEBP supported · Max 5 MB</div>
                    </div>
                  </div>
                  <p className="se-file-note">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    Leave empty to keep the existing photo
                  </p>
                </div>
              </div>

              <div className="se-hr" />

              {/* ── Submit ── */}
              <Button type="submit" className="se-submit" disabled={loading}>
                {loading ? (
                  <><span className="se-spinner" /> Updating Student…</>
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

              <p className="se-footer-note">
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