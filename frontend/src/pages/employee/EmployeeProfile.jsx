import { useMemo, useRef, useState } from "react";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { useAuthStore } from "../../store/authStore";
import { useEmployeeStore } from "../../store/employeeStore";
import { toast } from "../../store/notificationStore";
import "./EmployeeProfile.css";

const BANNER_PRESETS = [
  "linear-gradient(135deg, #7c3aed, #06b6d4)",
  "linear-gradient(135deg, #0f766e, #22c55e)",
  "linear-gradient(135deg, #ea580c, #f59e0b)",
  "linear-gradient(135deg, #1d4ed8, #38bdf8)",
  "linear-gradient(135deg, #7c3aed, #ec4899)",
  "linear-gradient(135deg, #be123c, #f97316)",
];

export function EmployeeProfile() {
  const user          = useAuthStore((s) => s.user);
  const lang          = useAuthStore((s) => s.lang);
  const preferences   = useAuthStore((s) => s.preferences);
  const role          = useAuthStore((s) => s.role);
  const updateProfile       = useAuthStore((s) => s.updateProfile);
  const updatePasswordByEmail = useEmployeeStore((s) => s.updatePasswordByEmail);

  const avatarRef = useRef();
  const bannerRef = useRef();

  const [pwForm, setPwForm]   = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [pwDone, setPwDone]   = useState(false);

  const displayName = user?.name || "Employee";
  const title       = user?.company ? `${user.company} team member` : "Perx member";
  const preferredTags = preferences.length > 0 ? preferences : ["Wellbeing", "Food", "Growth"];

  const initials = useMemo(
    () =>
      displayName.trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase(),
    [displayName],
  );

  const bannerStyle = useMemo(() => {
    const b = user?.banner;
    if (!b) return { backgroundImage: BANNER_PRESETS[0] };
    if (b.startsWith("url(")) return { backgroundImage: b, backgroundSize: "cover", backgroundPosition: "center" };
    return { backgroundImage: b };
  }, [user?.banner]);

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateProfile({ avatar: ev.target.result });
      toast.success("Profile photo updated");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleBannerFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateProfile({ banner: `url("${ev.target.result}")` });
      toast.success("Cover image updated");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handlePasswordSave() {
    setPwError("");
    if (!pwForm.current) { setPwError("Enter your current password"); return; }

    const storedEmployee = useEmployeeStore.getState().employees.find((e) => e.email === user?.email);
    if (storedEmployee && storedEmployee.password !== pwForm.current) {
      setPwError("Current password is incorrect");
      return;
    }

    if (pwForm.next.length < 6)    { setPwError("New password must be at least 6 characters"); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError("Passwords do not match"); return; }
    updatePasswordByEmail(user.email, pwForm.next);
    setPwDone(true);
    setPwForm({ current: "", next: "", confirm: "" });
    toast.success("Password updated successfully");
    setTimeout(() => setPwDone(false), 4000);
  }

  return (
    <div className="employee-profile-page">

      {/* ── Banner ── */}
      <section className="profile-banner" style={bannerStyle}>
        <div className="profile-banner-overlay" />
        <div className="profile-banner-content">
          <div className="profile-avatar-zone">
            <button
              className="profile-avatar-btn"
              onClick={() => avatarRef.current.click()}
              title="Change profile photo"
            >
              <Avatar src={user?.avatar} name={displayName} size="2xl" ring />
              <div className="profile-avatar-hover-label">Change photo</div>
            </button>
            <input ref={avatarRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            <div>
              <p className="profile-kicker">Employee profile</p>
              <h1>{displayName}</h1>
              <p className="profile-subtitle">{title}</p>
            </div>
          </div>

          <div className="profile-banner-actions">
            <div className="profile-banner-meta">
              <Badge color="green">{role || "employee"}</Badge>
              <Badge color="cyan">{lang?.toUpperCase?.() ?? "EN"}</Badge>
            </div>
            <button
              className="profile-change-cover-btn"
              onClick={() => bannerRef.current.click()}
            >
              Change cover
            </button>
            <input ref={bannerRef} type="file" accept="image/*" hidden onChange={handleBannerFile} />
          </div>
        </div>
      </section>

      {/* ── Banner presets ── */}
      <section className="profile-card profile-banner-card">
        <p className="profile-section-title">Appearance</p>
        <h2>Cover style</h2>
        <div className="profile-swatch-row">
          {BANNER_PRESETS.map((preset) => (
            <button
              key={preset}
              className={`profile-swatch ${user?.banner === preset ? "active" : ""}`}
              style={{ backgroundImage: preset }}
              onClick={() => { updateProfile({ banner: preset }); toast.success("Banner updated"); }}
              aria-label="Set banner"
            />
          ))}
          <button
            className="profile-swatch profile-swatch-upload"
            onClick={() => bannerRef.current.click()}
            title="Upload custom image"
          >
            ↑
          </button>
        </div>
      </section>

      {/* ── Info + Password ── */}
      <section className="profile-layout">
        <article className="profile-card profile-identity-card">
          <div className="profile-identity-head">
            <div className="profile-avatar-wrap">
              <Avatar src={user?.avatar} name={displayName} size="2xl" ring />
              <div className="profile-avatar-copy">
                <span className="profile-avatar-label">Profile picture</span>
                <strong>{displayName}</strong>
                <p>{user?.email || "No email on file"}</p>
              </div>
            </div>
            <button
              className="profile-edit-link"
              onClick={() => avatarRef.current.click()}
            >
              Change photo
            </button>
          </div>

          <div className="profile-grid">
            <div>
              <span>Full name</span>
              <strong>{user?.name || "Employee"}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{user?.email || "Not provided"}</strong>
            </div>
            <div>
              <span>Initials</span>
              <strong>{initials || "EM"}</strong>
            </div>
            <div>
              <span>Language</span>
              <strong>{lang?.toUpperCase?.() ?? "EN"}</strong>
            </div>
          </div>
        </article>

        <article className="profile-card profile-password-card">
          <p className="profile-section-title">Security</p>
          <h2>Change password</h2>

          <div className="profile-pw-form">
            <div className="profile-pw-field">
              <label>Current password</label>
              <input
                type="password"
                className="profile-pw-input"
                placeholder="••••••••"
                value={pwForm.current}
                onChange={(e) => { setPwForm((f) => ({ ...f, current: e.target.value })); setPwError(""); }}
              />
            </div>
            <div className="profile-pw-field">
              <label>New password</label>
              <input
                type="password"
                className="profile-pw-input"
                placeholder="Min. 6 characters"
                value={pwForm.next}
                onChange={(e) => { setPwForm((f) => ({ ...f, next: e.target.value })); setPwError(""); }}
              />
            </div>
            <div className="profile-pw-field">
              <label>Confirm new password</label>
              <input
                type="password"
                className="profile-pw-input"
                placeholder="••••••••"
                value={pwForm.confirm}
                onChange={(e) => { setPwForm((f) => ({ ...f, confirm: e.target.value })); setPwError(""); }}
              />
            </div>

            {pwError && <p className="profile-pw-error">{pwError}</p>}
            {pwDone  && <p className="profile-pw-success">Password updated!</p>}

            <button className="profile-pw-save-btn" onClick={handlePasswordSave}>
              Save password
            </button>
          </div>
        </article>
      </section>

      {/* ── Interests ── */}
      <section className="profile-details-grid">
        <article className="profile-card">
          <p className="profile-section-title">Recommended for you</p>
          <h2>Your interests</h2>
          <p className="profile-summary-copy">
            These tags came from onboarding and shape the perks you see first.
          </p>
          <div className="profile-tag-list">
            {preferredTags.map((tag) => (
              <span key={tag} className="profile-tag">{tag}</span>
            ))}
          </div>
          <div className="profile-insight-row" style={{ marginTop: 14 }}>
            <div><span>Saved interests</span><strong>{preferredTags.length}</strong></div>
            <div><span>Profile status</span><strong>Active</strong></div>
          </div>
        </article>

        <article className="profile-card">
          <p className="profile-section-title">Account</p>
          <h2>Details</h2>
          <ul className="profile-list">
            <li><span>Role</span><strong>Employee</strong></li>
            <li><span>Access</span><strong>Employee dashboard</strong></li>
            <li><span>Onboarding</span><strong>{useAuthStore.getState().onboardingCompleted ? "Complete" : "Pending"}</strong></li>
            <li><span>Experience</span><strong>Personalised perks feed</strong></li>
          </ul>
        </article>
      </section>
    </div>
  );
}
