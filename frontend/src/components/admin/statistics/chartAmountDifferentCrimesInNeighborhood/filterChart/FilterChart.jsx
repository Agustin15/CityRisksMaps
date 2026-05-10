import styles from "./FilterChart.module.css";

export const FilterChart = ({
  years,
  neighborhoods,
  setYearSelected,
  setNeighborhoodSelected
}) => {
  return (
    <div className={styles.containSelect}>
      <select onChange={(event) => setYearSelected(event.target.value)}>
        {years.length > 0 &&
          years.map((year, index) => (
            <option value={Object.values(year)} key={index}>
              {Object.values(year)}
            </option>
          ))}
      </select>
      <select
        onChange={(event) => {
          setNeighborhoodSelected(JSON.parse(event.target.value));
        }}
      >
        {neighborhoods.length > 0 &&
          neighborhoods.map((neighborhood, index) => (
            <option value={JSON.stringify(neighborhood)} key={index}>
              {neighborhood.name}
            </option>
          ))}
      </select>
    </div>
  );
};
