import { EMPLOYEES, getTopPerks } from "../../mock/employerData";
import { APPROVALS_SEED } from "../../mock/employerData";
import "../../components/shared/PerkCard.css";
import "../employee/EmployeePages.css";
import "./EmployerPages.css";

const CATEGORY_SPEND = [
  { label: "Fitness",  amount: 315, color: "#7c3aed" },
  { label: "Food",     amount: 180, color: "#06b6d4" },
  { label: "Health",   amount: 210, color: "#10b981" },
  { label: "Learning", amount: 90,  color: "#f59e0b" },
  { label: "Travel",   amount: 30,  color: "#8b5cf6" },
];

export function Insights() {
  const topPerks     = getTopPerks();
  const maxUsage     = topPerks[0]?.used ?? 1;
  const totalBudget  = EMPLOYEES.reduce((s, e) => s + e.budgetTotal, 0);
  const usedBudget   = EMPLOYEES.reduce((s, e) => s + e.budgetUsed, 0);
  const approvedCount = APPROVALS_SEED.filter((a) => a.status === "approved").length;
  const maxSpend     = Math.max(...CATEGORY_SPEND.map((c) => c.amount));

  return (
    <div className="dashboard-feed employer-insights">
      <header className="feed-header">
        <p className="feed-kicker">Insights</p>
        <h1>Benefits analytics</h1>
        <p className="feed-copy">
          See how your team is spending their benefit budget and which perks are
          most popular.
        </p>
      </header>

      <section className="dashboard-metrics">
        <div className="dashboard-metric-card">
          <span>Budget used</span>
          <strong>€{usedBudget}</strong>
        </div>
        <div className="dashboard-metric-card">
          <span>Remaining</span>
          <strong>€{totalBudget - usedBudget}</strong>
        </div>
        <div className="dashboard-metric-card">
          <span>Approved requests</span>
          <strong>{approvedCount}</strong>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="employer-section-heading">
          <div>
            <p className="feed-kicker">Most used</p>
            <h2>Top perks</h2>
          </div>
        </div>

        <div
          className="employer-list"
          style={{ padding: "18px 20px", background: "rgba(15,23,42,0.78)", borderRadius: 18, border: "1px solid rgba(148,163,184,0.12)" }}
        >
          <div className="insights-bar-list">
            {topPerks.map((perk) => (
              <div className="insights-bar-row" key={perk.id}>
                <span className="insights-bar-label">{perk.title}</span>
                <div className="insights-bar-track">
                  <div
                    className="insights-bar-fill"
                    style={{ width: `${(perk.used / maxUsage) * 100}%` }}
                  />
                </div>
                <span className="insights-bar-count">{perk.used}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dashboard-section" style={{ marginTop: 28 }}>
        <div className="employer-section-heading">
          <div>
            <p className="feed-kicker">Breakdown</p>
            <h2>Spend by category</h2>
          </div>
        </div>

        <div
          className="employer-list"
          style={{ padding: "18px 20px", background: "rgba(15,23,42,0.78)", borderRadius: 18, border: "1px solid rgba(148,163,184,0.12)" }}
        >
          <div className="insights-bar-list">
            {CATEGORY_SPEND.map((cat) => (
              <div className="insights-bar-row" key={cat.label}>
                <span className="insights-bar-label">{cat.label}</span>
                <div className="insights-bar-track">
                  <div
                    className="insights-bar-fill"
                    style={{
                      width: `${(cat.amount / maxSpend) * 100}%`,
                      background: `linear-gradient(90deg, ${cat.color}99, ${cat.color})`,
                    }}
                  />
                </div>
                <span className="insights-bar-count">€{cat.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
