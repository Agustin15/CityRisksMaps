import iconWarning from "../../../../assets/img/warningMenuRoutes.png";
import styles from "./Advice.module.css";

export const Advice = () => {
  return (
    <div className={styles.advice}>
      <img src={iconWarning}></img>
      <p>
        Debe seleccionar la opcion de mostrar denuncias de homicidios o de encuestas 
        por barrio para que podamos mostrarle el nivel de seguridad de las rutas
      </p>
    </div>
  );
};
