import { useState, useRef, useEffect } from "react";
import { Avatar } from "../ui/Avatar";
import { useAuthStore } from "../../store/authStore";
import { useCartStore, cartCount } from "../../store/cartStore";
import { useTranslationStore, LANGUAGES, getLangDict } from "../../store/translationStore";

const IconBell = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const IconCart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const IconGlobe = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

export function Topbar() {
  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.role);

  const items      = useCartStore((s) => s.items);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const count      = cartCount(items);

  const lang    = useTranslationStore((s) => s.lang);
  const setLang = useTranslationStore((s) => s.setLang);
  const dict    = getLangDict(lang);
  const t = (key) => dict?.[key] ?? key;

  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef();

  const currentLang = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectLang(code) {
    setLang(code);
    setDropOpen(false);
  }

  const portalLabel = t(`${role} portal`);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-heading">
          <strong>{t("Workspace") || "Workspace"}</strong>
          <span>{portalLabel}</span>
        </div>
      </div>

      <div className="topbar-actions">

        {/* Language selector */}
        <div className="lang-selector" ref={dropRef}>
          <button
            className="lang-selector-btn"
            onClick={() => setDropOpen((v) => !v)}
            aria-label="Select language"
          >
            <IconGlobe />
            <span className="lang-selector-flag">{currentLang.flag}</span>
            <span className="lang-selector-code">{lang.toUpperCase()}</span>
          </button>

          {dropOpen && (
            <div className="lang-dropdown">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  className={`lang-option ${lang === l.code ? "active" : ""}`}
                  onClick={() => selectLang(l.code)}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                  {lang === l.code && <span className="lang-check">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="topbar-icon-btn" aria-label="Notifications">
          <IconBell />
        </button>

        {role === "employee" && (
          <button
            className="topbar-icon-btn topbar-cart-btn"
            aria-label="Cart"
            onClick={openDrawer}
          >
            <IconCart />
            {count > 0 && (
              <span className="topbar-cart-badge">{count}</span>
            )}
          </button>
        )}

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
