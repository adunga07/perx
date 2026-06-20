import { Link } from "react-router-dom";
import { perks } from "../../mock/perks";
import "./EmployeePages.css";

// TODO: BudgetMeter, recent requests, approval statuses, notifications
export function EmployeeDashboard() {
  const featuredPerks = perks.slice(0, 3);

  return (
    <div className="dashboard-feed employee-dashboard">
      <header className="feed-header">
        <p className="feed-kicker">Employee dashboard</p>
        <h1>Your benefits at a glance</h1>
        <p className="feed-copy">
          Track your perks, review what is waiting for approval, and jump into
          the marketplace when you want to discover more.
        </p>
        <div className="dashboard-actions">
          <Link className="dashboard-primary-action" to="/employee/marketplace">
            Browse marketplace
          </Link>
          <Link className="dashboard-secondary-action" to="/employee/benefits">
            My benefits
          </Link>
        </div>
      </header>

      <section className="dashboard-metrics">
        <div className="dashboard-metric-card">
          <span>Available perks</span>
          <strong>{perks.length}</strong>
        </div>
        <div className="dashboard-metric-card">
          <span>Pending requests</span>
          <strong>02</strong>
        </div>
        <div className="dashboard-metric-card">
          <span>Total savings</span>
          <strong>€142</strong>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="feed-kicker">Featured perks</p>
            <h2>Highlights worth opening</h2>
          </div>
          <Link to="/employee/marketplace">View all</Link>
        </div>

        <div className="dashboard-feature-list">
          {featuredPerks.map((perk) => (
            <article className="dashboard-feature-item" key={perk.id}>
              <div>
                <p>{perk.companyName}</p>
                <h3>{perk.title}</h3>
              </div>
              <Link to={`/employee/perks/${perk.id}`}>Open details</Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
