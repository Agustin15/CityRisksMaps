import styles from "./Years.module.css";
import { useCrud } from "../../../../../../contexts/adminContext/CrudContext";

export const Years = ({ years, yearSelected }) => {
  const { setYearSelected, setPages, setRegisters, crimeSelected, fetchGet } =
    useCrud();

  const handleChange = async (year) => {
    setYearSelected(year);
    let url =
      "/neighborhoodCrimeAdmin/neighborhoodsCrimesByYearOffset" +
      "/" +
      crimeSelected +
      "/" +
      year +
      "/0";

    const registers = await fetchGet(url);

    if (registers) {
      if (registers.pages) setPages(registers.pages);

      if (registers.registersOffset) setRegisters(registers.registersOffset);
      else setRegisters(registers);
    }
  };

  return (
    <div className={styles.years}>
      <select onChange={(event) => handleChange(event.target.value)}>
        {years.map((year, index) => (
          <option defaultValue={year == yearSelected} key={index} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};
