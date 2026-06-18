import styles from "../styles/ui.module.css";

function SortBy({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}) {
  return (
    <div className={styles.controlsGrid}>
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="sortBy">
          Sort by
        </label>
        <select
          className={styles.select}
          id="sortBy"
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <option value="creationDate">Creation Date</option>
          <option value="title">Title</option>
        </select>
      </div>
      <div className={styles.fieldGroup}>
        <label className={styles.label} htmlFor="sortDirection">
          Order
        </label>
        <select
          className={styles.select}
          id="sortDirection"
          value={sortDirection}
          onChange={(e) => onSortDirectionChange(e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
}

export default SortBy;
