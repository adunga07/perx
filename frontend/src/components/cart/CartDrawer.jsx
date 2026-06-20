import { useCartStore, cartTotal, cartCount } from "../../store/cartStore";
import "./CartDrawer.css";

function formatPrice(amount) {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function CartDrawer() {
  const items      = useCartStore((s) => s.items);
  const open       = useCartStore((s) => s.drawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty  = useCartStore((s) => s.updateQty);
  const clear      = useCartStore((s) => s.clear);

  const count = cartCount(items);
  const total = cartTotal(items);

  return (
    <>
      {open && (
        <div className="cart-backdrop" onClick={closeDrawer} aria-hidden="true" />
      )}

      <aside className={`cart-drawer ${open ? "open" : ""}`} aria-label="Cart">
        <div className="cart-header">
          <div>
            <strong>Cart</strong>
            {count > 0 && <span className="cart-count-pill">{count}</span>}
          </div>
          <button className="cart-close" onClick={closeDrawer} aria-label="Close cart">✕</button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon">🛒</span>
            <p>Your cart is empty</p>
            <span>Browse the marketplace to add perks</span>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(({ perk, quantity }) => {
                const discounted =
                  perk.discount > 0
                    ? perk.price - (perk.price * perk.discount) / 100
                    : perk.price;

                return (
                  <div className="cart-item" key={perk.id}>
                    <div className="cart-item-image">
                      {perk.image ? (
                        <img src={perk.image} alt={perk.title} />
                      ) : (
                        <div className="cart-item-image-placeholder" />
                      )}
                    </div>

                    <div className="cart-item-body">
                      <div className="cart-item-top">
                        <div>
                          <p className="cart-item-company">{perk.companyName}</p>
                          <p className="cart-item-title">{perk.title}</p>
                        </div>
                        <button
                          className="cart-item-remove"
                          onClick={() => removeItem(perk.id)}
                          aria-label={`Remove ${perk.title}`}
                        >
                          ✕
                        </button>
                      </div>

                      <div className="cart-item-bottom">
                        <div className="cart-qty">
                          <button onClick={() => updateQty(perk.id, quantity - 1)}>−</button>
                          <span>{quantity}</span>
                          <button onClick={() => updateQty(perk.id, quantity + 1)}>+</button>
                        </div>
                        <div className="cart-item-price">
                          {perk.discount > 0 && (
                            <span className="cart-item-old">{formatPrice(perk.price)}</span>
                          )}
                          <strong>{formatPrice(discounted * quantity)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-footer">
              <div className="cart-total-row">
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <button className="cart-checkout-btn">Submit request</button>
              <button className="cart-clear-btn" onClick={clear}>Clear cart</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
