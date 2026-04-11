import styles from "./Pagination.module.css";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";

export const Pagination = ({ route }) => {
  const {
    fetchGet,
    pages,
    index,
    setIndex,
    setRegisters,
    yearSelected,
    crimeSelected
  } = useCrud();

  const handleClickPage = async (page) => {
    setIndex(page);
    let url =
      route +
      (crimeSelected ? "/" + crimeSelected : "") +
      (yearSelected ? "/" + yearSelected : "") +
      ("/" + page * 10);

    let result = await fetchGet(url);
    setRegisters(result.registersOffset);
  };

  return (
    <div className={styles.pagination}>
      <ul>
        {pages &&
          Array.from({ length: pages }, (v, index) => index).map((page) => (
            <li key={page}>
              <button
                className={index == page ? styles.disabled : ""}
                onClick={() => handleClickPage(page)}
              >
                {page + 1}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};
