import styles from "./Pagination.module.css";
import { useCrud } from "../../../../../../contexts/adminContext/CrudContext";

export const Pagination = ({ dateSelected }) => {
  const { fetchGet, pages, index, setIndex, setRegisters } = useCrud();

  const handleClickPage = async (page) => {
    setIndex(page);
    setRegisters();
    let url =
      "/auditoryNeighborhoodCrime/auditoryNeighborhoodsCrimesOffsetByDate/" +
      encodeURIComponent(dateSelected) +
      "/" +
      page * 10;

    const result = await fetchGet(url);

    setRegisters(result.registersOffset);
  };
  return (
    <div className={styles.pagination}>
      <ul>
        {Array.from({ length: pages }, (v, index) => index).map((page) => (
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
