import { useZoneCrimes } from "../../../../contexts/ZoneCrimesContext";
import { Chart } from "../../chart/Chart";
import { ColorRate } from "../colorRate/ColorRate";
import styles from "../Table.module.css";

export const Rows = ({ numberRow, quiz }) => {
  const { indexChartActive, setIndexChartActive } = useZoneCrimes();

  const handleClickRow = () => {
    if (indexChartActive == numberRow) {
      setIndexChartActive(null);
    } else setIndexChartActive(numberRow);
  };

  return (
    <>
      <tr
        onClick={() => handleClickRow()}
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
            {
              <Chart
                categoryCrime={null}
                nameNeighborhood={quiz.name}
              />
            }
          </td>
        </tr>
      )}
    </>
  );
};
