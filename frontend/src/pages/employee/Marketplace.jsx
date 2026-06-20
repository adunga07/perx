import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryFilter } from "../../components/shared/CategoryFilter";
import { PerkCard } from "../../components/shared/PerkCard";
import { SearchBar } from "../../components/shared/SearchBar";
import { perks } from "../../mock/perks";
import "./EmployeePages.css";
import "../../components/shared/PerkCard.css";

function uniqueCategories(items) {
  return [...new Set(items.flatMap((item) => item.tags ?? []))];
}

export function Marketplace() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = useMemo(() => uniqueCategories(perks), []);

  const filteredPerks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return perks.filter((perk) => {
      const matchesSearch =
        query.length === 0 ||
        perk.title.toLowerCase().includes(query) ||
        perk.companyName.toLowerCase().includes(query) ||
        perk.tags.some((tag) => tag.toLowerCase().includes(query));

      const matchesCategory =
        selectedCategory === "" || perk.tags.includes(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div className="dashboard-feed marketplace-page">
      <header className="feed-header">
        <p className="feed-kicker">Marketplace</p>
        <h1>Browse employee perks</h1>
        <p className="feed-copy">
          Search and filter available offers, then open any perk to review the
          full details.
        </p>
      </header>

      <div className="marketplace-controls">
        <SearchBar
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search perks or providers"
        />
        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategory ? [selectedCategory] : []}
          onToggle={(category) => setSelectedCategory(category)}
        />
      </div>

      <div className="feed-grid">
        {filteredPerks.map((perk) => (
          <article className="feed-card-wrap" key={perk.id}>
            <PerkCard
              perk={perk}
              compact
              onSelect={(item) => navigate(`/employee/perks/${item.id}`)}
            />
          </article>
        ))}
      </div>

      {filteredPerks.length === 0 && (
        <div className="marketplace-empty">
          <h2>No perks matched your search</h2>
          <p>Try a different keyword or clear the category filter.</p>
        </div>
      )}
    </div>
  );
}
