import { useCartStore } from "../../store/cartStore";
import "./PerkCard.css";

export function PerkCard({
  perk,
  business,
  showActions,
  compact,
  onSelect,
  onApprove,
  onReject,
}) {
  const addItem    = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const activePerk = perk ?? {
    title: "Perk preview",
    image: "",
    companyName: "Your company",
    discount: 0,
    price: 0,
    tags: ["Food", "Gym", "Health"],
  };

  const discountedPrice =
    activePerk?.discount > 0
      ? activePerk.price - (activePerk.price * activePerk.discount) / 100
      : activePerk.price;

  return (
    <div
      className={`perk-card ${compact ? "compact" : ""}`}
      onClick={() => onSelect?.(activePerk)}
    >
      {/* IMAGE */}
      <div className="perk-image-container">
        {activePerk.image ? (
          <img
            src={activePerk.image}
            alt={activePerk.title}
            className="perk-image"
          />
        ) : (
          <div className="perk-image perk-image-placeholder">
            <span>No image</span>
          </div>
        )}

        {activePerk?.companyName && (
          <div className="perk-company-bubble">{activePerk.companyName}</div>
        )}

        {activePerk?.discount > 0 && (
          <div className="perk-badge">-{activePerk.discount}%</div>
        )}
      </div>

      {/* CONTENT */}
      <div className="perk-body">
        <div className="perk-title">{activePerk?.title}</div>

        {business?.name && <div className="perk-business">{business.name}</div>}

        {/* TAGS */}
        <div className="perk-tags">
          {activePerk?.tags?.map((tag) => (
            <span key={tag} className="perk-tag">
              {tag}
            </span>
          ))}
        </div>

        {/* PRICING */}
        <div className="perk-pricing">
          {activePerk?.discount > 0 ? (
            <>
              <span className="old-price">€{activePerk.price}</span>

              <span className="new-price">€{discountedPrice.toFixed(2)}</span>
            </>
          ) : (
            <span className="new-price">€{activePerk?.price}</span>
          )}
        </div>

        {/* ACTIONS */}
        <button
          className="perk-cart-btn"
          onClick={(e) => {
            e.stopPropagation();
            addItem(activePerk);
            openDrawer();
          }}
        >
          Add to Cart
        </button>

        {/* ADMIN ACTIONS */}
        {showActions && (
          <div className="perk-actions">
            <button
              className="approve-btn"
              onClick={(e) => {
                e.stopPropagation();
                onApprove?.(perk);
              }}
            >
              Approve
            </button>

            <button
              className="reject-btn"
              onClick={(e) => {
                e.stopPropagation();
                onReject?.(perk);
              }}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
