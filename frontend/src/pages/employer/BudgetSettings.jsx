import { useState } from "react";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { EMPLOYEES, CATEGORY_CAPS } from "../../mock/employerData";
import "../../components/shared/PerkCard.css";
import "../employee/EmployeePages.css";
import "./EmployerPages.css";

export function BudgetSettings() {
  const [perEmployee, setPerEmployee] = useState(300);
  const [caps, setCaps] = useState(CATEGORY_CAPS);

  const totalMonthly = perEmployee * EMPLOYEES.length;
  const usedBudget   = EMPLOYEES.reduce((s, e) => s + e.budgetUsed, 0);

  function updateCap(id, value) {
    setCaps((prev) =>
      prev.map((c) => (c.id === id ? { ...c, cap: Number(value) } : c)),
    );
  }

  return (
    <div className="dashboard-feed employer-budget">
      <header className="feed-header">
        <p className="feed-kicker">Budget settings</p>
        <h1>Benefit budget</h1>
        <p className="feed-copy">
          Set the monthly allowance per employee and cap spend by category.
          Changes apply from the next billing cycle.
        </p>
      </header>

      <div className="budget-total-card">
        <div>
          <div className="budget-total-label">Monthly per employee</div>
          <div className="budget-total-value">€{perEmployee}</div>
        </div>
        <div style={{ flex: 1, maxWidth: 280 }}>
          <ProgressBar
            value={usedBudget}
            max={totalMonthly}
            color="cyan"
            label={`€${usedBudget} of €${totalMonthly} used`}
            showPercent
            thick
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            style={{
              fontSize: "0.72rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "rgba(226,232,240,0.45)",
            }}
          >
            Allowance (€)
          </label>
          <input
            type="number"
            className="budget-cap-input"
            value={perEmployee}
            min={0}
            step={10}
            onChange={(e) => setPerEmployee(Number(e.target.value))}
            style={{ width: 100 }}
          />
        </div>
      </div>

      <div className="employer-section-heading">
        <div>
          <p className="feed-kicker">Per category</p>
          <h2>Category caps</h2>
        </div>
        <button className="budget-save-btn">Save changes</button>
      </div>

      <div className="budget-cat-list">
        {caps.map((cat) => (
          <div className="budget-cat-row" key={cat.id}>
            <div>
              <div className="budget-cat-label">{cat.label}</div>
              <div className="budget-cat-sub">Max per employee / month</div>
            </div>
            <ProgressBar
              value={Math.min(cat.cap, perEmployee)}
              max={perEmployee}
              color={cat.cap >= perEmployee ? "amber" : "cyan"}
            />
            <input
              type="number"
              className="budget-cap-input"
              value={cat.cap}
              min={0}
              max={perEmployee}
              step={10}
              onChange={(e) => updateCap(cat.id, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
