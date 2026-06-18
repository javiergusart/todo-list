import styles from "../styles/ui.module.css";

function FilterInput({ filterTerm, onFilterChange }) {
  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label} htmlFor="filterInput">
        Search todos
      </label>
      <input
        className={styles.input}
        id="filterInput"
        type="text"
        value={filterTerm}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder="Search by title..."
        maxLength={80}
      />
    </div>
  );
}

export default FilterInput;
