// TODO: fixed bottom tab bar for <768px
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/Button";

const NAV_LINKS = {
  employee: [
    { to: "/employee", label: "Home", icon: "⌂" },
    { to: "/employee/marketplace", label: "Market", icon: "⌕" },
    { to: "/employee/profile", label: "Profile", icon: "◌" },
  ],
  employer: [
    { to: "/employer", label: "Home", icon: "⌂" },
    { to: "/employer/approvals", label: "Approvals", icon: "✓" },
    { to: "/employer/budget", label: "Budget", icon: "¤" },
  ],
  provider: [
    { to: "/provider", label: "Home", icon: "⌂" },
    { to: "/provider/offers", label: "Offers", icon: "✦" },
    { to: "/provider/profile", label: "Profile", icon: "◌" },
  ],
};

export function MobileNav() {
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const links = NAV_LINKS[role] ?? NAV_LINKS.employee;

  const handleSignOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="mobile-nav" aria-label="Primary mobile">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `mobile-nav-item ${isActive ? "active" : ""}`
          }
        >
          <span aria-hidden="true">{link.icon}</span>
          <span>{link.label}</span>
        </NavLink>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        className="mobile-nav-item mobile-nav-signout"
      >
        <span aria-hidden="true">⇢</span>
        <span>Out</span>
      </Button>
    </nav>
  );
}
