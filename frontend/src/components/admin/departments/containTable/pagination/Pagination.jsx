import styles from "./Pagination.module.css";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { useParams } from "react-router";

export const Pagination = ({ route, controller }) => {
  const { fetchGet, pages, index, setIndex, setRegisters, yearSelected } =
    useCrud();
  let params = useParams();

  const handleClickPage = async (page) => {
    setIndex(page);
    let url =
      route +
      JSON.stringify({
        option: controller,
        ...(yearSelected && {
          year: yearSelected
        }),
        offset: page * 10,
        ...(params.id && {
          id: params.id
        })
      });

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
