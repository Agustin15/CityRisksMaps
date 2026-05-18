import styles from "./Keyboard.module.css";
import iconDelete from "../../../../assets/img/deleteKeyboard.png";
import { useTwoStepAuth } from "../../../../contexts/adminContext/TwoStepAuthContext";
import { useParams } from "react-router";

export const Keyboard = () => {
  const { loadingForm, handleClick } = useTwoStepAuth();
  const params = useParams();

  const keyboard = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["0", <img src={iconDelete}></img>, "OK"]
  ];

  return (
    <ul className={styles.keyboard}>
      {keyboard.map((row, indexRow) => (
        <li key={indexRow}>
          <ul>
            {row.map((column, indexColumn) => (
              <li key={indexColumn}>
                <button
                  disabled={loadingForm}
                  type="button"
                  onClick={() =>
                    handleClick(indexColumn, indexRow, column, params.token)
                  }
                >
                  {column}
                </button>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
};
