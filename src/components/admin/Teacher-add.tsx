import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Teacher } from "@/app/admin/teachers/addteacher/page";

interface AddTeacherPageProps {
  onSubmit: (teacher: Teacher) => Promise<void>;
  loading: boolean;
}

export default function AddTeacherPage({ onSubmit, loading }: AddTeacherPageProps) {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const teacher: Teacher = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      Teacher_Designation: formData.get("designation") as string,
      Teacher_Professionality: formData.get("professionality") as string,
      Teacher_Phone_Number: formData.get("phone") as string,
      status: formData.get("status") as string,
      image: formData.get("image") as File,
    };
    await onSubmit(teacher);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        .at-wrap {
          min-height: 100vh;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .at-card {
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
        .at-header {
          background: linear-gradient(135deg, #3b5bfa 0%, #5c7cfa 100%);
          padding: 2rem 2.5rem 2rem;
          position: relative;
          overflow: hidden;
        }
        .at-header-blob1 {
          position: absolute; top: -50px; right: -50px;
          width: 180px; height: 180px;
          background: rgba(255,255,255,0.08); border-radius: 50%;
        }
        .at-header-blob2 {
          position: absolute; bottom: -70px; right: 80px;
          width: 140px; height: 140px;
          background: rgba(255,255,255,0.05); border-radius: 50%;
        }
        .at-header-top {
          display: flex; align-items: flex-start;
          justify-content: space-between;
          position: relative; z-index: 1;
        }
        .at-header-icon {
          width: 50px; height: 50px;
          background: rgba(255,255,255,0.15);
          border-radius: 14px; display: flex;
          align-items: center; justify-content: center;
          backdrop-filter: blur(6px);
        }
        .at-header-icon svg { color: #fff; }
        .at-header-badge {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 20px; padding: 4px 12px;
          font-size: 0.7rem; font-weight: 600;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        .at-header-title {
          font-size: 1.65rem; font-weight: 700;
          color: #fff; margin: 1rem 0 0.3rem;
          letter-spacing: -0.02em;
          position: relative; z-index: 1;
        }
        .at-header-sub {
          font-size: 0.82rem; color: rgba(255,255,255,0.68);
          font-weight: 400; margin: 0;
          position: relative; z-index: 1;
        }

        /* ─── Body ─── */
        .at-body { padding: 2rem 2.5rem 2.5rem; }

        /* ─── Section divider ─── */
        .at-sec {
          display: flex; align-items: center;
          gap: 0.65rem; margin: 1.5rem 0 1.1rem;
        }
        .at-sec:first-child { margin-top: 0; }
        .at-sec-pill {
          display: flex; align-items: center; gap: 6px;
          background: #eef2ff; border-radius: 20px;
          padding: 4px 12px; flex-shrink: 0;
        }
        .at-sec-pill svg { color: #3b5bfa; }
        .at-sec-pill span {
          font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.09em;
          color: #3b5bfa;
        }
        .at-sec-line { flex: 1; height: 1px; background: #e2e8f0; }

        /* ─── Grid ─── */
        .at-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
        .at-field { display: flex; flex-direction: column; gap: 0.45rem; margin-bottom: 1rem; }
        .at-field:last-of-type { margin-bottom: 0; }

        .at-label {
          font-size: 0.775rem; font-weight: 600;
          color: #374151; letter-spacing: 0.01em;
          display: flex; align-items: center; gap: 3px;
        }
        .at-star { color: #3b5bfa; font-size: 0.8rem; }

        /* ─── Input overrides ─── */
        .at-body input[type="text"],
        .at-body input[type="email"],
        .at-body input[type="tel"] {
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
        .at-body input[type="text"]::placeholder,
        .at-body input[type="email"]::placeholder,
        .at-body input[type="tel"]::placeholder {
          color: #b0bac6 !important; font-weight: 400 !important;
        }
        .at-body input[type="text"]:focus,
        .at-body input[type="email"]:focus,
        .at-body input[type="tel"]:focus {
          border-color: #3b5bfa !important;
          background: #fff !important;
          box-shadow: 0 0 0 3.5px rgba(59, 91, 250, 0.1) !important;
        }

        /* ─── Select ─── */
        .at-body button[role="combobox"] {
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
        .at-body button[role="combobox"]:focus,
        .at-body button[role="combobox"][data-state="open"] {
          border-color: #3b5bfa !important;
          background: #fff !important;
          box-shadow: 0 0 0 3.5px rgba(59, 91, 250, 0.1) !important;
          outline: none !important;
        }

        /* ─── Status badges ─── */
        .at-badges { display: flex; gap: 6px; margin-top: 6px; }
        .at-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 9px; border-radius: 20px;
          font-size: 0.68rem; font-weight: 600;
        }
        .at-badge-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .badge-green { background: #dcfce7; color: #15803d; }
        .badge-red   { background: #fee2e2; color: #b91c1c; }

        /* ─── File upload ─── */
        .at-file-wrap { position: relative; }
        .at-body input[type="file"] {
          position: absolute; inset: 0; opacity: 0;
          cursor: pointer; width: 100%; height: 100%; z-index: 2;
        }
        .at-file-box {
          display: flex; align-items: center; gap: 0.9rem;
          background: #f8fafc;
          border: 1.5px dashed #c7d2fe;
          border-radius: 10px; padding: 0.8rem 1rem;
          cursor: pointer; transition: border-color 0.18s, background 0.18s;
        }
        .at-file-box:hover { border-color: #3b5bfa; background: #eef2ff; }
        .at-file-icon {
          width: 40px; height: 40px;
          background: #eef2ff; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .at-file-icon svg { color: #3b5bfa; }
        .at-file-main { font-size: 0.82rem; color: #3b5bfa; font-weight: 600; }
        .at-file-sub  { font-size: 0.7rem; color: #94a3b8; margin-top: 2px; }

        /* ─── Divider ─── */
        .at-hr { height: 1px; background: #f1f5f9; margin: 1.75rem 0 1.5rem; }

        /* ─── Submit ─── */
        .at-submit {
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
        .at-submit:hover:not(:disabled) {
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 22px rgba(59,91,250,0.4) !important;
        }
        .at-submit:active:not(:disabled) { transform: translateY(0) !important; }
        .at-submit:disabled { opacity: 0.65 !important; cursor: not-allowed !important; }

        .at-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: at-spin 0.65s linear infinite; flex-shrink: 0;
        }
        @keyframes at-spin { to { transform: rotate(360deg); } }

        .at-footer-note {
          display: flex; align-items: center; justify-content: center;
          gap: 5px; margin-top: 1rem;
          font-size: 0.71rem; color: #94a3b8;
        }
        .at-footer-note svg { color: #94a3b8; }

        @media (max-width: 540px) {
          .at-row { grid-template-columns: 1fr; }
          .at-header, .at-body { padding-left: 1.5rem; padding-right: 1.5rem; }
        }
      `}</style>

      <div className="at-wrap">
        <div className="at-card">

          {/* Header */}
          <div className="at-header">
            <div className="at-header-blob1" />
            <div className="at-header-blob2" />
            <div className="at-header-top">
              <div className="at-header-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="at-header-badge">New Faculty</div>
            </div>
            <h1 className="at-header-title">Add New Teacher</h1>
            <p className="at-header-sub">Register a new faculty member to the portal</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="at-body">

              {/* ── Section: Personal ── */}
              <div className="at-sec">
                <div className="at-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                  <span>Personal Info</span>
                </div>
                <div className="at-sec-line" />
              </div>

              <div className="at-row">
                <div className="at-field">
                  <label className="at-label" htmlFor="name">Full Name <span className="at-star">*</span></label>
                  <Input id="name" name="name" placeholder="e.g. Sarah Johnson" required />
                </div>
                <div className="at-field">
                  <label className="at-label" htmlFor="phone">Phone Number <span className="at-star">*</span></label>
                  <Input id="phone" name="phone" type="tel" placeholder="+92 300 0000000" required />
                </div>
              </div>

              <div className="at-field">
                <label className="at-label" htmlFor="email">Email Address <span className="at-star">*</span></label>
                <Input id="email" name="email" type="email" placeholder="teacher@school.edu.pk" required />
              </div>

              {/* ── Section: Professional ── */}
              <div className="at-sec">
                <div className="at-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  </svg>
                  <span>Professional Info</span>
                </div>
                <div className="at-sec-line" />
              </div>

              <div className="at-row">
                <div className="at-field">
                  <label className="at-label" htmlFor="designation">Designation <span className="at-star">*</span></label>
                  <Input id="designation" name="designation" placeholder="e.g. Senior Lecturer" required />
                </div>
                <div className="at-field">
                  <label className="at-label" htmlFor="status">Status <span className="at-star">*</span></label>
                  <Select name="status">
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
                  <div className="at-badges">
                    <span className="at-badge badge-green"><span className="at-badge-dot" style={{ background:'#16a34a' }}/>Active</span>
                    <span className="at-badge badge-red"><span className="at-badge-dot" style={{ background:'#dc2626' }}/>Inactive</span>
                  </div>
                </div>
              </div>

              <div className="at-field">
                <label className="at-label" htmlFor="professionality">Area of Expertise <span className="at-star">*</span></label>
                <Input id="professionality" name="professionality" placeholder="e.g. Mathematics, Physics, Computer Science" required />
              </div>

              {/* ── Section: Photo ── */}
              <div className="at-sec">
                <div className="at-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>Profile Photo</span>
                </div>
                <div className="at-sec-line" />
              </div>

              <div className="at-field">
                <label className="at-label" htmlFor="image">Upload Image <span className="at-star">*</span></label>
                <div className="at-file-wrap">
                  <Input id="image" name="image" type="file" accept="image/*" required />
                  <div className="at-file-box">
                    <div className="at-file-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <div>
                      <div className="at-file-main">Click to browse or drag & drop</div>
                      <div className="at-file-sub">PNG, JPG, WEBP supported · Max 5 MB</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="at-hr" />

              {/* Submit */}
              <Button type="submit" className="at-submit" disabled={loading}>
                {loading ? (
                  <><span className="at-spinner" /> Registering Teacher…</>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12l7 7 7-7"/>
                    </svg>
                    Register Teacher
                  </>
                )}
              </Button>

              <p className="at-footer-note">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                All fields are required · Information is securely stored
              </p>

            </div>
          </form>

        </div>
      </div>
    </>
  );
}