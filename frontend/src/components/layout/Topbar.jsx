import { Avatar } from "../ui/Avatar";
import { useAuthStore } from "../../store/authStore";

const IconBell = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

export function Topbar() {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);
  const lang = useAuthStore((state) => state.lang);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-heading">
          <strong>Workspace</strong>
          <span>{role || "employee"} portal</span>
        </div>
      </div>

      <div className="topbar-actions">
        <span className="topbar-lang-chip">{lang?.toUpperCase?.() ?? "EN"}</span>

        <button className="topbar-icon-btn" aria-label="Notifications">
          <IconBell />
        </button>

        <div className="topbar-divider" aria-hidden="true" />

        <div className="topbar-user">
          <Avatar
            name={user?.name || "Employee"}
            src={user?.avatar}
            size="sm"
          />
          <div>
            <strong>{user?.name || "Employee"}</strong>
            <span>{user?.email || "Signed in"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
