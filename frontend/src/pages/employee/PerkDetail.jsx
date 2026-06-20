import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { PerkCard } from "../../components/shared/PerkCard";
import { perks } from "../../mock/perks";
import "./PerkDetail.css";

function formatPrice(amount) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function PerkDetail() {
  const { perkId } = useParams();
  const navigate = useNavigate();
  const perk = perks.find((item) => item.id === perkId);

  if (!perk) {
    return <Navigate to="/employee/marketplace" replace />;
  }

  const discountedPrice =
    perk.discount > 0
      ? perk.price - (perk.price * perk.discount) / 100
      : perk.price;
  const savings = perk.price - discountedPrice;
  const relatedPerks = perks.filter((item) => item.id !== perk.id).slice(0, 3);
  const primaryTag = perk.tags?.[0] ?? "Perk";

  return (
    <div className="perk-detail-page">
      <div className="perk-detail-shell">
        <nav className="perk-detail-nav" aria-label="Breadcrumb">
          <Link to="/employee/marketplace" className="perk-detail-back">
            <span aria-hidden="true">←</span>
            Back to marketplace
          </Link>
          <span className="perk-detail-pill">{primaryTag}</span>
        </nav>

        <section className="perk-hero">
          <div className="perk-hero-copy">
            <p className="perk-eyebrow">{perk.companyName}</p>
            <h1>{perk.title}</h1>
            <p className="perk-summary">
              A curated employee benefit designed to feel premium, useful, and
              easy to redeem.
            </p>

            <div className="perk-tag-row">
              {perk.tags.map((tag) => (
                <span key={tag} className="perk-chip">
                  {tag}
                </span>
              ))}
            </div>

            <div className="perk-stats">
              <div>
                <span>Current price</span>
                <strong>{formatPrice(perk.price)}</strong>
              </div>
              <div>
                <span>You save</span>
                <strong>{formatPrice(savings)}</strong>
              </div>
              <div>
                <span>Discount</span>
                <strong>{perk.discount}%</strong>
              </div>
            </div>

            <div className="perk-actions-row">
              <button
                className="perk-primary-action"
                onClick={() => navigate("/employee/marketplace")}
              >
                Add to request
              </button>
              <button
                className="perk-secondary-action"
                onClick={() => navigate("/employee/benefits")}
              >
                View my benefits
              </button>
            </div>
          </div>

          <div className="perk-hero-visual">
            <div className="perk-image-frame">
              {perk.image ? (
                <img src={perk.image} alt={perk.title} />
              ) : (
                <div className="perk-image-fallback">No image available</div>
              )}
              <div className="perk-image-overlay">
                <span>{perk.companyName}</span>
                <strong>-{perk.discount}%</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="perk-detail-grid">
          <article className="perk-info-card perk-info-card--wide">
            <h2>Overview</h2>
            <p>
              {perk.title} from {perk.companyName} is built to be simple to
              understand at a glance and valuable enough to keep employees
              engaged.
            </p>
            <div className="perk-fact-list">
              <div>
                <span>Provider</span>
                <strong>{perk.companyName}</strong>
              </div>
              <div>
                <span>Original price</span>
                <strong>{formatPrice(perk.price)}</strong>
              </div>
              <div>
                <span>Discounted price</span>
                <strong>{formatPrice(discountedPrice)}</strong>
              </div>
              <div>
                <span>Best for</span>
                <strong>{perk.tags.slice(0, 2).join(" + ")}</strong>
              </div>
            </div>
          </article>

          <article className="perk-info-card">
            <h2>What you get</h2>
            <ul className="perk-benefit-list">
              <li>Instant access to a focused, high-value employee perk.</li>
              <li>Clear pricing with the savings shown upfront.</li>
              <li>Relevant tags that make discovery and filtering easy.</li>
              <li>
                A professional offer card you can review before requesting.
              </li>
            </ul>
          </article>

          <article className="perk-info-card">
            <h2>How it works</h2>
            <ol className="perk-step-list">
              <li>Review the perk and confirm it matches your needs.</li>
              <li>Add it to your request or approval flow.</li>
              <li>Track it from your benefits area once approved.</li>
            </ol>
          </article>
        </section>

        <section className="perk-related-section">
          <div className="perk-section-heading">
            <div>
              <p className="perk-eyebrow">Related perks</p>
              <h2>More offers worth exploring</h2>
            </div>
            <Link to="/employee/marketplace">Browse all</Link>
          </div>

          <div className="perk-related-grid">
            {relatedPerks.map((relatedPerk) => (
              <PerkCard
                key={relatedPerk.id}
                perk={relatedPerk}
                compact
                onSelect={(item) => navigate(`/employee/perks/${item.id}`)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
