import iconWarning from "../../../../assets/img/warningMenuRoutes.png";
import styles from "./Advice.module.css";

export const Advice = () => {
  return (
    <div className={styles.advice}>
      <img src={iconWarning}></img>
      <p>
        Debe seleccionar la opcion de mostrar denuncias de homicidios o de encuestas 
        por barrio para que podamos calificar las rutas
      </p>
    </div>
  );
};
