import styles from "../Table.module.css";
import { Chart } from "../../chart/Chart";
import { ColorRate } from "../colorRate/ColorRate";
import { useZoneCrimes } from "../../../../contexts/ZoneCrimesContext";

export const Rows = ({ numberRow, quiz, handleClickNeighborhood }) => {
  const { indexChartActive, setIndexChartActive } = useZoneCrimes();

  const handleClickRow = (neighborhood) => {
    if (indexChartActive == numberRow) {
      setIndexChartActive(null);
    } else setIndexChartActive(numberRow);
    handleClickNeighborhood(neighborhood);
  };

  return (
    <>
      <tr
        onClick={() => handleClickRow(quiz.name)}
        key={numberRow}
        className={numberRow % 2 == 0 ? styles.trGray : styles.trWhite}
      >
        <td>
          <div className={styles.nameNeighborhood}>
            <ColorRate total={quiz.total} percentage={quiz.percentage} />
            {quiz.name}
          </div>
        </td>
        <td>{quiz.secure}</td>
        <td>{quiz.insecure}</td>
        <td>{quiz.total}</td>

        <td>{quiz.total == 0 ? "Sin encuestas" : quiz.percentage + "%"}</td>
      </tr>
      {indexChartActive == numberRow && (
        <tr>
          <td colSpan={5}>
            {<Chart categoryCrime={null} nameNeighborhood={quiz.name} />}
          </td>
        </tr>
      )}
    </>
  );
};
