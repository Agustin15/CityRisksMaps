import styles from "./List.module.css";
import iconNotData from "../../../../../assets/img/notData.png";
import { useListQuizes } from "../../../../../contexts/quizesContext/ListQuizesContext";
import { Item } from "./item/Item";

export const List = () => {
  const {
    resultQuizes,
    loadingYears,
    loadingQuizes,
    refSelectYear,
    getLimitQuizesByParticipantAndYear,
    pages,
    index,
    setIndex,
    errorSearch
  } = useListQuizes();

  const handleChangePage = async (pageToChange) => {
    setIndex(pageToChange);
    getLimitQuizesByParticipantAndYear(
      refSelectYear.current.value,
      pageToChange
    );
  };

  return (
    <div className={styles.containList}>
      <ul>
        {loadingQuizes == true && (
          <span className={styles.loading}>Cargando encuestas...</span>
        )}

        {loadingQuizes == false && loadingYears == false && !resultQuizes && (
          <div className={styles.notData}>
            <img src={iconNotData}></img>
            {errorSearch}
          </div>
        )}

        {loadingQuizes == false &&
          resultQuizes &&
          resultQuizes.map((quiz, index) => (
            <Item key={index} quiz={quiz} indexItem={index} />
          ))}
      </ul>

      {pages && (
        <div className={styles.pagination}>
          {Array.from({ length: pages }, (v, i) => i).map((page, indexBtn) => (
            <button
              key={indexBtn}
              onClick={() => handleChangePage(page)}
              className={page == index ? styles.currentPage : ""}
            >
              {page + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
