// TODO: debounced input 300ms
export function SearchBar({ value, onChange, placeholder = "" }) {
  return (
    <input
      className="search-bar"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}
