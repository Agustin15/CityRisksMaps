import styles from "./Pagination.module.css";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";

export const Pagination = ({ route, controller }) => {
  const { fetchGet, pages, index, setIndex, setRegisters } = useCrud();

  const handleClickPage = async (page) => {
    setIndex(page);
    let url =
      route +
      JSON.stringify({
        option: controller,
        offset: page * 10
      });
    setRegisters(await fetchGet(url, "GET"));
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
