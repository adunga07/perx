// TODO: horizontal scrolling pill row
export function CategoryFilter({
  categories = [],
  selectedCategories = [],
  onToggle,
}) {
  const isSelected = (category) => selectedCategories.includes(category);

  return (
    <div
      className="category-filter"
      role="tablist"
      aria-label="Perk categories"
    >
      <button
        type="button"
        className={`category-pill ${selectedCategories.length === 0 ? "active" : ""}`}
        onClick={() => onToggle?.("")}
      >
        All
      </button>

      {categories.map((category) => (
        <button
          key={category}
          type="button"
          className={`category-pill ${isSelected(category) ? "active" : ""}`}
          aria-pressed={isSelected(category)}
          onClick={() => onToggle?.(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
