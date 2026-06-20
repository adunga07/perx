import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CategoryFilter } from "../../components/shared/CategoryFilter";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useAuthStore } from "../../store/authStore";
import { perks } from "../../mock/perks";
import "./MyBenefits.css";

const HISTORY_SEED = [
  {
    perkId: "food-1",
    status: "used",
    actionLabel: "Redeemed lunch deal",
    date: "2026-06-02",
    quantity: 1,
  },
  {
    perkId: "gym-1",
    status: "bought",
    actionLabel: "Monthly training access",
    date: "2026-04-07",
    quantity: 1,
  },
  {
    perkId: "health-1",
    status: "pending",
    actionLabel: "Waiting for clinic approval",
    date: "2026-05-21",
    quantity: 1,
  },
  {
    perkId: "food-1",
    status: "used",
    actionLabel: "Weekend lunch special",
    date: "2026-04-19",
    quantity: 1,
  },
  {
    perkId: "gym-1",
    status: "bought",
    actionLabel: "Purchased gym pass",
    date: "2026-05-28",
    quantity: 2,
  },
];

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function BenefitRecord({ record }) {
  const { perk, status, actionLabel, date, finalPrice, savings } = record;

  return (
    <article className="benefit-record">
      <div className="benefit-record-image">
        {perk.image ? (
          <img src={perk.image} alt={perk.title} />
        ) : (
          <div className="benefit-record-image-placeholder" />
        )}
        {perk.discount > 0 && (
          <span className="benefit-record-discount">-{perk.discount}%</span>
        )}
      </div>

      <div className="benefit-record-body">
        <div className="benefit-record-top">
          <div className="benefit-record-meta">
            <StatusBadge status={status} />
            <span className="benefit-record-date">{formatDate(date)}</span>
          </div>
          <Link
            className="benefit-record-detail-link"
            to={`/employee/perks/${perk.id}`}
          >
            View details
          </Link>
        </div>

        <p className="benefit-record-company">{perk.companyName}</p>
        <h3 className="benefit-record-title">{perk.title}</h3>
        <p className="benefit-record-action">{actionLabel}</p>

        <div className="benefit-record-tags">
          {perk.tags?.map((tag) => (
            <span key={tag} className="benefit-record-tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="benefit-record-financials">
          <div className="benefit-record-stat">
            <span>Paid</span>
            <strong>{formatCurrency(finalPrice)}</strong>
          </div>
          {savings > 0 && (
            <div className="benefit-record-stat benefit-record-stat--saved">
              <span>Saved</span>
              <strong>{formatCurrency(savings)}</strong>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export function MyBenefits() {
  const user = useAuthStore((state) => state.user);
  const [selectedCategory, setSelectedCategory] = useState("");

  const records = useMemo(() => {
    return HISTORY_SEED.map((entry, index) => {
      const perk = perks.find((item) => item.id === entry.perkId) ?? perks[0];
      const discountedPrice =
        perk.discount > 0
          ? perk.price - (perk.price * perk.discount) / 100
          : perk.price;

      return {
        id: `${entry.perkId}-${index}`,
        ...entry,
        perk,
        originalPrice: perk.price,
        finalPrice: discountedPrice,
        savings: perk.price - discountedPrice,
        category: perk.tags?.[0] ?? "Benefit",
      };
    });
  }, []);

  const categories = useMemo(
    () => [...new Set(perks.flatMap((item) => item.tags ?? []))],
    [],
  );

  const filteredRecords = records.filter((record) => {
    if (!selectedCategory) return true;
    return record.perk.tags?.includes(selectedCategory);
  });

  const totalSpent = records
    .filter((r) => r.status !== "pending")
    .reduce((sum, r) => sum + r.finalPrice, 0);

  const totalSavings = records.reduce((sum, r) => sum + r.savings, 0);
  const completedCount = records.filter((r) => r.status === "used").length;

  return (
    <div className="dashboard-feed benefits-page">
      <header className="feed-header">
        <p className="feed-kicker">My benefits</p>
        <h1>{user?.name ? `${user.name}'s record` : "Your benefit record"}</h1>
        <p className="feed-copy">
          A complete record of perks you have used, bought, or still have
          pending for approval.
        </p>

        <div className="benefits-stats-row">
          <div className="benefits-stat">
            <strong>{records.length}</strong>
            <span>Total records</span>
          </div>
          <div className="benefits-stat-divider" />
          <div className="benefits-stat">
            <strong>{completedCount}</strong>
            <span>Redeemed</span>
          </div>
          <div className="benefits-stat-divider" />
          <div className="benefits-stat">
            <strong>{formatCurrency(totalSpent)}</strong>
            <span>Total spent</span>
          </div>
          <div className="benefits-stat-divider" />
          <div className="benefits-stat benefits-stat--highlight">
            <strong>{formatCurrency(totalSavings)}</strong>
            <span>Total saved</span>
          </div>
        </div>
      </header>

      <div className="benefits-toolbar">
        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategory ? [selectedCategory] : []}
          onToggle={(category) => setSelectedCategory(category)}
        />
        <Link className="benefits-marketplace-link" to="/employee/marketplace">
          Browse more perks
        </Link>
      </div>

      <section className="benefits-list">
        {filteredRecords.map((record) => (
          <BenefitRecord key={record.id} record={record} />
        ))}

        {filteredRecords.length === 0 && (
          <div className="benefits-empty">
            <h2>No records in this filter</h2>
            <p>Switch category to see another part of your perk history.</p>
          </div>
        )}
      </section>
    </div>
  );
}
