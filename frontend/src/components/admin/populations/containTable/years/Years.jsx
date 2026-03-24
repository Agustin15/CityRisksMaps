import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
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

  const handleClick = async (year) => {
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
    <ul className={styles.years}>
      {years.map((year, index) => (
        <li
          key={index}
          onClick={() => handleClick(year)}
          className={yearSelected == year ? styles.selected : ""}
        >
          {year}
        </li>
      ))}
    </ul>
  );
};
