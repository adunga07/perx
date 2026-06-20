import { useNavigate } from "react-router-dom";
import { PerkCard } from "../../components/shared/PerkCard";
import { perks } from "../../mock/perks";
import "../../components/shared/PerkCard.css";

// TODO: BudgetMeter, recent perks, pending request statuses
export function EmployeeDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-feed">
      <header className="feed-header">
        <p className="feed-kicker">Employee dashboard</p>
        <h1>Fresh perks for you</h1>
        <p className="feed-copy">
          New offers, updated discounts, and health-first benefits in one feed.
        </p>
      </header>

      <div className="feed-grid">
        {perks.map((perk) => (
          <article className="feed-card-wrap" key={perk.id}>
            <PerkCard
              perk={perk}
              compact
              onSelect={(item) => navigate(`/employee/perks/${item.id}`)}
            />
          </article>
        ))}
      </div>
    </div>
  );
}
