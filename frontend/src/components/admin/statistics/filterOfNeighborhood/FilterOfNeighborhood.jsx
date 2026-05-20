import styles from "../Statistics.module.css";
import { useEffect } from "react";
import { loadData } from "../functions.js";

export const FilterOfNeighborhood = ({
  neighborhoods,
  setNeighborhoods,
  setNeighborhoodSelected,
  setLoading,
  setError
}) => {
  const loadFilter = async () => {
    setLoading(true);
    try {
      const neighborhoods = await loadData("/admin/neighborhood/allNeighborhoods");
      setNeighborhoods(neighborhoods);
      setNeighborhoodSelected(neighborhoods[0]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilter();
  }, []);

  return (
    <select
      onChange={(event) =>
        setNeighborhoodSelected(JSON.parse(event.target.value))
      }
    >
      {neighborhoods.length > 0 &&
        neighborhoods.map((neighborhood, index) => (
          <option value={JSON.stringify(neighborhood)} key={index}>
            {neighborhood.name}
          </option>
        ))}
    </select>
  );
};
