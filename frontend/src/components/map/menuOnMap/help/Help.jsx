import styles from "./Help.module.css";
import iconAbout from "../../../../assets/img/help.png";
import { useNavigate } from "react-router";

export const Help = () => {
  let navigate = useNavigate();

  return (
    <div className={styles.help}>
      <button onClick={() => navigate("/about")}>
        <img src={iconAbout}></img>
      </button>
    </div>
  );
};
