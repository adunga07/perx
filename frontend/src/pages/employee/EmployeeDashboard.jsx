import { Link } from "react-router-dom";
import { perks } from "../../mock/perks";
import { useT } from "../../hooks/useT";
import "./EmployeePages.css";

export function EmployeeDashboard() {
  const t = useT();
  const featuredPerks = perks.slice(0, 3);

  return (
    <div className="dashboard-feed employee-dashboard">
      <header className="feed-header">
        <p className="feed-kicker">{t("Employee dashboard")}</p>
        <h1>{t("Your benefits at a glance")}</h1>
        <p className="feed-copy">
          {t("Track your perks, review what is waiting for approval, and jump into the marketplace when you want to discover more.")}
        </p>
        <div className="dashboard-actions">
          <Link className="dashboard-primary-action" to="/employee/marketplace">
            {t("Browse marketplace")}
          </Link>
          <Link className="dashboard-secondary-action" to="/employee/benefits">
            {t("My benefits")}
          </Link>
        </div>
      </header>

      <section className="dashboard-metrics">
        <div className="dashboard-metric-card">
          <span>{t("Available perks")}</span>
          <strong>{perks.length}</strong>
        </div>
        <div className="dashboard-metric-card">
          <span>{t("Pending requests")}</span>
          <strong>02</strong>
        </div>
        <div className="dashboard-metric-card">
          <span>{t("Total savings")}</span>
          <strong>€142</strong>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <p className="feed-kicker">{t("Featured perks")}</p>
            <h2>{t("Highlights worth opening")}</h2>
          </div>
          <Link to="/employee/marketplace">{t("View all")}</Link>
        </div>

        <div className="dashboard-feature-list">
          {featuredPerks.map((perk) => (
            <article className="dashboard-feature-item" key={perk.id}>
              <div>
                <p>{perk.companyName}</p>
                <h3>{perk.title}</h3>
              </div>
              <Link to={`/employee/perks/${perk.id}`}>{t("Open details")}</Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
