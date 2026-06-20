import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { useAuthStore } from "../../store/authStore";
import "./EmployeeProfile.css";

function buildAccent(name) {
  if (!name) {
    return "linear-gradient(135deg, #7c3aed, #06b6d4)";
  }

  const seeds = name
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  const palettes = [
    "linear-gradient(135deg, #7c3aed, #06b6d4)",
    "linear-gradient(135deg, #0f766e, #22c55e)",
    "linear-gradient(135deg, #ea580c, #f59e0b)",
    "linear-gradient(135deg, #1d4ed8, #38bdf8)",
  ];

  return palettes[seeds % palettes.length];
}

function formatLabel(value, fallback) {
  return value ? value : fallback;
}

export function EmployeeProfile() {
  const user = useAuthStore((state) => state.user);
  const lang = useAuthStore((state) => state.lang);
  const preferences = useAuthStore((state) => state.preferences);
  const role = useAuthStore((state) => state.role);
  const onboardingCompleted = useAuthStore(
    (state) => state.onboardingCompleted,
  );

  const displayName = user?.name || "Employee";
  const accent = useMemo(() => buildAccent(displayName), [displayName]);
  const title = user?.company ? `${user.company} team member` : "Perx member";
  const preferredTags =
    preferences.length > 0 ? preferences : ["Wellbeing", "Food", "Growth"];
  const initials = useMemo(
    () =>
      displayName
        .trim()
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
    [displayName],
  );

  return (
    <div className="employee-profile-page">
      <section
        className="profile-banner"
        style={{ "--profile-accent": accent }}
      >
        <div className="profile-banner-glow" />
        <div className="profile-banner-content">
          <div>
            <p className="profile-kicker">Employee profile</p>
            <h1>{displayName}</h1>
            <p className="profile-subtitle">{title}</p>
          </div>

          <div className="profile-banner-meta">
            <Badge color="green">{role || "employee"}</Badge>
            <Badge color="cyan">{lang?.toUpperCase?.() ?? "EN"}</Badge>
            <Badge color={onboardingCompleted ? "purple" : "gray"}>
              {onboardingCompleted
                ? "Onboarding complete"
                : "Onboarding pending"}
            </Badge>
          </div>
        </div>
      </section>

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
            <Link className="profile-edit-link" to="/employee/marketplace">
              Open marketplace
            </Link>
          </div>

          <div className="profile-grid">
            <div>
              <span>Full name</span>
              <strong>{formatLabel(user?.name, "Employee")}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{formatLabel(user?.email, "Not provided")}</strong>
            </div>
            <div>
              <span>Company</span>
              <strong>{formatLabel(user?.company, "Perx workspace")}</strong>
            </div>
            <div>
              <span>Member type</span>
              <strong>Employee</strong>
            </div>
          </div>
        </article>

        <aside className="profile-card profile-summary-card">
          <p className="profile-section-title">Recommended for you</p>
          <h2>Your selected interests</h2>
          <p className="profile-summary-copy">
            These tags came from onboarding and help shape the offers you see
            first.
          </p>

          <div className="profile-tag-list">
            {preferredTags.map((tag) => (
              <span key={tag} className="profile-tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="profile-insight-row">
            <div>
              <span>Saved interests</span>
              <strong>{preferredTags.length}</strong>
            </div>
            <div>
              <span>Profile status</span>
              <strong>Active</strong>
            </div>
          </div>
        </aside>
      </section>

      <section className="profile-details-grid">
        <article className="profile-card">
          <p className="profile-section-title">About the user</p>
          <h2>Relevant account info</h2>
          <ul className="profile-list">
            <li>
              <span>Initials</span>
              <strong>{initials || "EM"}</strong>
            </li>
            <li>
              <span>Language</span>
              <strong>{lang?.toUpperCase?.() ?? "EN"}</strong>
            </li>
            <li>
              <span>Access</span>
              <strong>Employee dashboard</strong>
            </li>
            <li>
              <span>Experience</span>
              <strong>Personalised perks feed</strong>
            </li>
          </ul>
        </article>

        <article className="profile-card">
          <p className="profile-section-title">Next steps</p>
          <h2>Where to go next</h2>
          <p className="profile-summary-copy">
            Use the marketplace to browse new perks, then open a perk detail
            page to review the full offer before requesting it.
          </p>
          <div className="profile-action-stack">
            <Link className="profile-primary-action" to="/employee/marketplace">
              Browse perks
            </Link>
            <Link className="profile-secondary-action" to="/employee/benefits">
              View benefits
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
