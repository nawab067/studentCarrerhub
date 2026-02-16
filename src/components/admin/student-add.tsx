import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Student } from "@/app/admin/students/addStudent/page";

interface AddstudentPageProps {
  onSubmit: (student: Student) => Promise<void>;
  loading: boolean;
}

export default function AddstudentPage({ onSubmit, loading }: AddstudentPageProps) {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const student: Student = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      state: formData.get("state") as string,
      city: formData.get("city") as string,
      Roll_Number: formData.get("Roll_Number") as string,
      address: formData.get("address") as string,
      date_of_birth: formData.get("date_of_birth") as string,
      phone_number: formData.get("phone_number") as string,
      image_url: formData.get("image_url") as File
    };

    await onSubmit(student);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        .as-wrap {
          min-height: 100vh;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .as-card {
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
        .as-header {
          background: linear-gradient(135deg, #3b5bfa 0%, #5c7cfa 100%);
          padding: 2rem 2.5rem 2rem;
          position: relative;
          overflow: hidden;
        }
        .as-header-blob1 {
          position: absolute; top: -50px; right: -50px;
          width: 180px; height: 180px;
          background: rgba(255,255,255,0.08); border-radius: 50%;
        }
        .as-header-blob2 {
          position: absolute; bottom: -70px; right: 80px;
          width: 140px; height: 140px;
          background: rgba(255,255,255,0.05); border-radius: 50%;
        }
        .as-header-top {
          display: flex; align-items: flex-start;
          justify-content: space-between;
          position: relative; z-index: 1;
        }
        .as-header-icon {
          width: 50px; height: 50px;
          background: rgba(255,255,255,0.15);
          border-radius: 14px; display: flex;
          align-items: center; justify-content: center;
          backdrop-filter: blur(6px);
        }
        .as-header-icon svg { color: #fff; }
        .as-header-badge {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 20px; padding: 4px 12px;
          font-size: 0.7rem; font-weight: 600;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        .as-header-title {
          font-size: 1.65rem; font-weight: 700;
          color: #fff; margin: 1rem 0 0.3rem;
          letter-spacing: -0.02em;
          position: relative; z-index: 1;
        }
        .as-header-sub {
          font-size: 0.82rem; color: rgba(255,255,255,0.68);
          font-weight: 400; margin: 0;
          position: relative; z-index: 1;
        }

        /* ─── Body ─── */
        .as-body { padding: 2rem 2.5rem 2.5rem; }

        /* ─── Section divider ─── */
        .as-sec {
          display: flex; align-items: center;
          gap: 0.65rem; margin: 1.5rem 0 1.1rem;
        }
        .as-sec:first-child { margin-top: 0; }
        .as-sec-pill {
          display: flex; align-items: center; gap: 6px;
          background: #eef2ff; border-radius: 20px;
          padding: 4px 12px; flex-shrink: 0;
        }
        .as-sec-pill svg { color: #3b5bfa; }
        .as-sec-pill span {
          font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.09em;
          color: #3b5bfa;
        }
        .as-sec-line { flex: 1; height: 1px; background: #e2e8f0; }

        /* ─── Grid ─── */
        .as-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
        .as-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
        .as-field { display: flex; flex-direction: column; gap: 0.45rem; margin-bottom: 1rem; }

        .as-label {
          font-size: 0.775rem; font-weight: 600;
          color: #374151; letter-spacing: 0.01em;
          display: flex; align-items: center; gap: 3px;
        }
        .as-star { color: #3b5bfa; font-size: 0.8rem; }

        /* ─── Input overrides ─── */
        .as-body input[type="text"],
        .as-body input[type="email"],
        .as-body input[type="tel"],
        .as-body input[type="date"] {
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
        .as-body input[type="text"]::placeholder,
        .as-body input[type="email"]::placeholder,
        .as-body input[type="tel"]::placeholder {
          color: #b0bac6 !important; font-weight: 400 !important;
        }
        .as-body input[type="date"] { color: #64748b !important; }
        .as-body input[type="text"]:focus,
        .as-body input[type="email"]:focus,
        .as-body input[type="tel"]:focus,
        .as-body input[type="date"]:focus {
          border-color: #3b5bfa !important;
          background: #fff !important;
          box-shadow: 0 0 0 3.5px rgba(59, 91, 250, 0.1) !important;
        }

        /* ─── Roll number special styling ─── */
        .as-roll-wrap {
          position: relative;
        }
        .as-roll-prefix {
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.78rem;
          font-weight: 700;
          color: #3b5bfa;
          pointer-events: none;
          z-index: 1;
        }
        .as-roll-wrap input {
          padding-left: 2.5rem !important;
        }

        /* ─── File upload ─── */
        .as-file-wrap { position: relative; }
        .as-body input[type="file"] {
          position: absolute; inset: 0; opacity: 0;
          cursor: pointer; width: 100%; height: 100%; z-index: 2;
        }
        .as-file-box {
          display: flex; align-items: center; gap: 0.9rem;
          background: #f8fafc;
          border: 1.5px dashed #c7d2fe;
          border-radius: 10px; padding: 0.8rem 1rem;
          cursor: pointer; transition: border-color 0.18s, background 0.18s;
        }
        .as-file-box:hover { border-color: #3b5bfa; background: #eef2ff; }
        .as-file-icon {
          width: 40px; height: 40px;
          background: #eef2ff; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .as-file-icon svg { color: #3b5bfa; }
        .as-file-main { font-size: 0.82rem; color: #3b5bfa; font-weight: 600; }
        .as-file-sub  { font-size: 0.7rem; color: #94a3b8; margin-top: 2px; }

        /* ─── Divider ─── */
        .as-hr { height: 1px; background: #f1f5f9; margin: 1.75rem 0 1.5rem; }

        /* ─── Submit ─── */
        .as-submit {
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
        .as-submit:hover:not(:disabled) {
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 22px rgba(59,91,250,0.4) !important;
        }
        .as-submit:active:not(:disabled) { transform: translateY(0) !important; }
        .as-submit:disabled { opacity: 0.65 !important; cursor: not-allowed !important; }

        .as-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: as-spin 0.65s linear infinite; flex-shrink: 0;
        }
        @keyframes as-spin { to { transform: rotate(360deg); } }

        .as-footer-note {
          display: flex; align-items: center; justify-content: center;
          gap: 5px; margin-top: 1rem;
          font-size: 0.71rem; color: #94a3b8;
        }
        .as-footer-note svg { color: #94a3b8; }

        @media (max-width: 560px) {
          .as-row, .as-row-3 { grid-template-columns: 1fr; }
          .as-header, .as-body { padding-left: 1.5rem; padding-right: 1.5rem; }
        }
      `}</style>

      <div className="as-wrap">
        <div className="as-card">

          {/* ── Header ── */}
          <div className="as-header">
            <div className="as-header-blob1" />
            <div className="as-header-blob2" />
            <div className="as-header-top">
              <div className="as-header-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
              </div>
              <div className="as-header-badge">New Student</div>
            </div>
            <h1 className="as-header-title">Add New Student</h1>
            <p className="as-header-sub">Register a new student to the portal</p>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit}>
            <div className="as-body">

              {/* ── Section: Personal ── */}
              <div className="as-sec">
                <div className="as-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                  <span>Personal Info</span>
                </div>
                <div className="as-sec-line" />
              </div>

              <div className="as-row">
                <div className="as-field">
                  <label className="as-label" htmlFor="name">Full Name <span className="as-star">*</span></label>
                  <Input id="name" name="name" placeholder="e.g. Ahmed Khan" required />
                </div>
                <div className="as-field">
                  <label className="as-label" htmlFor="date_of_birth">Date of Birth <span className="as-star">*</span></label>
                  <Input id="date_of_birth" name="date_of_birth" type="date" required />
                </div>
              </div>

              <div className="as-row">
                <div className="as-field">
                  <label className="as-label" htmlFor="email">Email Address <span className="as-star">*</span></label>
                  <Input id="email" name="email" type="email" placeholder="student@school.edu.pk" required />
                </div>
                <div className="as-field">
                  <label className="as-label" htmlFor="phone_number">Phone Number <span className="as-star">*</span></label>
                  <Input id="phone_number" name="phone_number" type="tel" placeholder="+92 300 0000000" required />
                </div>
              </div>

              {/* ── Section: Academic ── */}
              <div className="as-sec">
                <div className="as-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                  </svg>
                  <span>Academic Info</span>
                </div>
                <div className="as-sec-line" />
              </div>

              <div className="as-field">
                <label className="as-label" htmlFor="Roll_Number">Roll Number <span className="as-star">*</span></label>
                <div className="as-roll-wrap">
                  <span className="as-roll-prefix">#</span>
                  <Input id="Roll_Number" name="Roll_Number" placeholder="e.g. 2024-CS-001" required />
                </div>
              </div>

              {/* ── Section: Location ── */}
              <div className="as-sec">
                <div className="as-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>Location</span>
                </div>
                <div className="as-sec-line" />
              </div>

              <div className="as-row">
                <div className="as-field">
                  <label className="as-label" htmlFor="state">State <span className="as-star">*</span></label>
                  <Input id="state" name="state" placeholder="e.g. Punjab" required />
                </div>
                <div className="as-field">
                  <label className="as-label" htmlFor="city">City <span className="as-star">*</span></label>
                  <Input id="city" name="city" placeholder="e.g. Lahore" required />
                </div>
              </div>

              <div className="as-field">
                <label className="as-label" htmlFor="address">Full Address <span className="as-star">*</span></label>
                <Input id="address" name="address" placeholder="e.g. House 12, Street 4, DHA Phase 5" required />
              </div>

              {/* ── Section: Photo ── */}
              <div className="as-sec">
                <div className="as-sec-pill">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span>Profile Photo</span>
                </div>
                <div className="as-sec-line" />
              </div>

              <div className="as-field">
                <label className="as-label" htmlFor="image_url">Upload Image <span className="as-star">*</span></label>
                <div className="as-file-wrap">
                  <Input id="image_url" name="image_url" type="file" accept="image/*" required />
                  <div className="as-file-box">
                    <div className="as-file-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <div>
                      <div className="as-file-main">Click to browse or drag & drop</div>
                      <div className="as-file-sub">PNG, JPG, WEBP supported · Max 5 MB</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="as-hr" />

              {/* ── Submit ── */}
              <Button type="submit" className="as-submit" disabled={loading}>
                {loading ? (
                  <><span className="as-spinner" /> Adding Student…</>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                    Register Student
                  </>
                )}
              </Button>

              <p className="as-footer-note">
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