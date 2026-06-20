import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { StatusBadge } from "../ui/StatusBadge";

const IconHome = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const IconShop = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const IconBenefits = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const IconProfile = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconBudget = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const IconTeam = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconOffers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="16"/>
    <line x1="10" y1="14" x2="14" y2="14"/>
  </svg>
);

const NAV_LINKS = {
  employee: [
    { to: "/employee", label: "Dashboard", icon: <IconHome /> },
    { to: "/employee/marketplace", label: "Marketplace", icon: <IconShop /> },
    { to: "/employee/benefits", label: "Benefits", icon: <IconBenefits /> },
    { to: "/employee/profile", label: "Profile", icon: <IconProfile /> },
  ],
  employer: [
    { to: "/employer", label: "Dashboard", icon: <IconHome /> },
    { to: "/employer/approvals", label: "Approvals", icon: <IconCheck /> },
    { to: "/employer/budget", label: "Budget", icon: <IconBudget /> },
    { to: "/employer/employees", label: "Employees", icon: <IconTeam /> },
  ],
  provider: [
    { to: "/provider", label: "Dashboard", icon: <IconHome /> },
    { to: "/provider/offers", label: "Offers", icon: <IconOffers /> },
    { to: "/provider/offers/new", label: "Add perk", icon: <IconBenefits /> },
    { to: "/provider/profile", label: "Profile", icon: <IconProfile /> },
  ],
};

export function Sidebar() {
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const links = NAV_LINKS[role] ?? NAV_LINKS.employee;

  const handleSignOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="sidebar" aria-label="Primary">
      <div className="sidebar-brand">
        <div className="sidebar-logo">P</div>
        <div>
          <strong>Perx</strong>
          <Badge
            color={
              role === "employer"
                ? "cyan"
                : role === "provider"
                  ? "amber"
                  : "purple"
            }
          >
            {role || "guest"}
          </Badge>
        </div>
      </div>

      <div className="sidebar-profile">
        <Avatar
          name={user?.name || "Employee"}
          src={user?.avatar}
          size="lg"
          ring
        />
        <div>
          <strong>{user?.name || "Employee"}</strong>
          <span>{user?.email || "Signed in user"}</span>
          <StatusBadge status={role ? "active" : "pending"} showIcon={false} />
        </div>
      </div>

      <div className="sidebar-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === `/${role}`}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon" aria-hidden="true">
              {link.icon}
            </span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        block
        onClick={handleSignOut}
        className="sidebar-signout"
      >
        Sign out
      </Button>
    </nav>
  );
}
