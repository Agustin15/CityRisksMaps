import styles from "./References.module.css";
import { getReferenceByCrime } from "./functions.js";

export const References = ({ categoryCrime }) => {
  const referenceData = getReferenceByCrime(categoryCrime);

  return (
    <div className={styles.references}>
      <h4>Referencias de tasas de denuncias:</h4>
      <ul className={styles.ulReferences}>
        {referenceData &&
          referenceData.map((data, index) => (
            <li key={index}>
              <div style={{ backgroundColor: data.color }}></div>
              <span>{data.range}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};
