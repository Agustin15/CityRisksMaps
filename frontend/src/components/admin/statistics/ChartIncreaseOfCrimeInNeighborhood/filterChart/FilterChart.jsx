import styles from "./FilterChart.module.css";

export const FilterChart = ({
  crimes,
  neighborhoods,
  setCrimeSelected,
  setNeighborhoodSelected
}) => {
  return (
    <div className={styles.containSelect}>
      <select onChange={(event) => setCrimeSelected(event.target.value)}>
        {crimes.length > 0 &&
          crimes.map((crime, index) => (
            <option value={crime.category} key={index}>
              {crime.category}
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
