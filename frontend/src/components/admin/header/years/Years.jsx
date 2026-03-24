import { useCrud } from "../../../../contexts/adminContext/CrudContext";
import styles from "./Years.module.css";

export const Years = ({ years, route, controller }) => {
  const {
    fetchGet,
    setRegisters,
    setPages,
    setIndex,
    yearSelected,
    setYearSelected
  } = useCrud();

  const handleChange = async (year) => {
    setYearSelected(year);

    let url =
      route +
      JSON.stringify({
        option: controller,
        offset: 0,
        year: year
      });

    setIndex(0);
    const result = await fetchGet(url);
    if (result) {
      setRegisters(result.registersOffset);
      setPages(result.pages);
    }
  };
  return (
    <div className={styles.years}>
      <select
        defaultValue={yearSelected}
        onChange={(event) => handleChange(event.target.value)}
      >
        {years.map((year, index) => (
          <option key={index} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};
