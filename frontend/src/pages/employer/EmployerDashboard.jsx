import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "../../components/ui/Avatar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { useAuthStore } from "../../store/authStore";
import { useT } from "../../hooks/useT";
import { EMPLOYEES, APPROVALS_SEED, enrichApproval } from "../../mock/employerData";
import "../../components/shared/PerkCard.css";
import "../employee/EmployeePages.css";
import "./EmployerPages.css";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "short",
  });
}

export function EmployerDashboard() {
  const t = useT();
  const user = useAuthStore((s) => s.user);
  const [approvals, setApprovals] = useState(() =>
    APPROVALS_SEED.map(enrichApproval),
  );

  function update(id, status) {
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  const pending = approvals.filter((a) => a.status === "pending");
  const totalBudget = EMPLOYEES.reduce((s, e) => s + e.budgetTotal, 0);
  const usedBudget  = EMPLOYEES.reduce((s, e) => s + e.budgetUsed, 0);

  return (
    <div className="dashboard-feed employer-dashboard">
      <header className="feed-header">
        <p className="feed-kicker">{t("Company dashboard")}</p>
        <h1>Welcome back{user?.name ? `, ${user.name}` : ""}</h1>
        <p className="feed-copy">
          Review pending perk requests, track your team's benefit budget, and
          keep everyone engaged.
        </p>
        <div className="dashboard-actions">
          <Link className="dashboard-primary-action" to="/employer/approvals">
            {t("Review approvals")}
          </Link>
          <Link className="dashboard-secondary-action" to="/employer/employees">
            {t("Manage employees")}
          </Link>
        </div>
      </header>

      <section className="dashboard-metrics">
        <div className="dashboard-metric-card">
          <span>{t("Employees")}</span>
          <strong>{EMPLOYEES.length}</strong>
        </div>
        <div className="dashboard-metric-card">
          <span>{t("Pending approvals")}</span>
          <strong>{pending.length}</strong>
        </div>
        <div className="dashboard-metric-card">
          <span>{t("Monthly budget")}</span>
          <strong>€{totalBudget}</strong>
        </div>
        <div className="dashboard-metric-card">
          <span>{t("Budget used")}</span>
          <strong>€{usedBudget}</strong>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="employer-section-heading">
          <div>
            <p className="feed-kicker">Needs attention</p>
            <h2>Pending approvals</h2>
          </div>
          <Link to="/employer/approvals">View all</Link>
        </div>

        <div className="employer-list">
          {pending.slice(0, 3).map((a) => (
            <div className="employer-row" key={a.id}>
              <Avatar name={a.employee?.name} size="sm" />
              <div className="employer-row-center">
                <div className="employer-row-info">
                  <strong>{a.employee?.name}</strong>
                  <span>{a.employee?.department}</span>
                </div>
                <div className="employer-row-perk">
                  <strong>{a.perk?.title}</strong>
                  <span>{a.perk?.companyName}</span>
                </div>
                <span className="employer-row-date">{formatDate(a.requestedAt)}</span>
              </div>
              <div className="employer-row-right">
                <button className="employer-btn-approve" onClick={() => update(a.id, "approved")}>{t("Approve")}</button>
                <button className="employer-btn-reject" onClick={() => update(a.id, "rejected")}>{t("Decline")}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-section" style={{ marginTop: 28 }}>
        <div className="employer-section-heading">
          <div>
            <p className="feed-kicker">Team</p>
            <h2>Budget overview</h2>
          </div>
          <Link to="/employer/employees">Manage</Link>
        </div>

        <div className="employer-list">
          {EMPLOYEES.map((emp) => {
            const pct = emp.budgetUsed / emp.budgetTotal;
            const color = pct >= 1 ? "red" : pct >= 0.8 ? "amber" : "cyan";
            return (
              <div className="employer-row" key={emp.id}>
                <Avatar name={emp.name} size="sm" />
                <div className="employer-row-center">
                  <div className="employer-row-info">
                    <strong>{emp.name}</strong>
                    <span>{emp.department}</span>
                  </div>
                  <div className="employer-row-budget">
                    <ProgressBar value={emp.budgetUsed} max={emp.budgetTotal} color={color} />
                    <div className="employer-budget-amounts">
                      <span>€{emp.budgetUsed} used</span>
                      <span>€{emp.budgetTotal} total</span>
                    </div>
                  </div>
                  <span />
                </div>
                <div className="employer-row-right">
                  <StatusBadge status={emp.status} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
