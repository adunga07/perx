import { useState } from "react";
import { Avatar } from "../../components/ui/Avatar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { APPROVALS_SEED, enrichApproval } from "../../mock/employerData";
import "../../components/shared/PerkCard.css";
import "../employee/EmployeePages.css";
import "./EmployerPages.css";

const TABS = ["all", "pending", "approved", "rejected"];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ApprovalQueue() {
  const [approvals, setApprovals] = useState(() =>
    APPROVALS_SEED.map(enrichApproval),
  );
  const [tab, setTab] = useState("pending");

  function update(id, status) {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a)),
    );
  }

  const filtered =
    tab === "all" ? approvals : approvals.filter((a) => a.status === tab);

  const counts = TABS.reduce((acc, t) => {
    acc[t] = t === "all" ? approvals.length : approvals.filter((a) => a.status === t).length;
    return acc;
  }, {});

  return (
    <div className="dashboard-feed employer-approvals">
      <header className="feed-header">
        <p className="feed-kicker">Approval queue</p>
        <h1>Perk requests</h1>
        <p className="feed-copy">
          Review and action benefit requests from your team. Approvals are
          processed instantly.
        </p>
      </header>

      <div className="employer-toolbar">
        <div className="employer-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`employer-tab ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {counts[t] > 0 && (
                <span style={{ marginLeft: 6, opacity: 0.6 }}>
                  {counts[t]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="employer-list">
        {filtered.length === 0 && (
          <div className="benefits-empty">
            <h2>No requests here</h2>
            <p>Switch tab to see other requests.</p>
          </div>
        )}

        {filtered.map((a) => (
          <div className="employer-row" key={a.id}>
            <Avatar name={a.employee?.name} size="sm" />
            <div className="employer-row-center">
              <div className="employer-row-info">
                <strong>{a.employee?.name}</strong>
                <span>{a.employee?.department}</span>
              </div>
              <div className="employer-row-perk">
                <strong>{a.perk?.title}</strong>
                <span>
                  {a.perk?.companyName}
                  {a.note ? ` · ${a.note}` : ""}
                </span>
              </div>
              <span className="employer-row-date">{formatDate(a.requestedAt)}</span>
            </div>
            <div className="employer-row-right">
              {a.status === "pending" ? (
                <>
                  <button
                    className="employer-btn-approve"
                    onClick={() => update(a.id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="employer-btn-reject"
                    onClick={() => update(a.id, "rejected")}
                  >
                    Decline
                  </button>
                </>
              ) : (
                <>
                  <StatusBadge status={a.status} />
                  {a.status !== "pending" && (
                    <button
                      className="employer-btn-reject"
                      style={{ fontSize: "0.72rem" }}
                      onClick={() => update(a.id, "pending")}
                    >
                      Undo
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
