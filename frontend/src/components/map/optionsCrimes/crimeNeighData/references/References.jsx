import styles from "./References.module.css";
import { getReferenceByCrime } from "./getReferences.js";

export const References = ({ categoryCrime }) => {
  const referenceData = getReferenceByCrime(categoryCrime);

  return (
    <ul className={styles.ulReferences}>
      {referenceData &&
        referenceData.map((data, index) => (
          <li key={index}>
            <div style={{ backgroundColor: data.color }}></div>
            <span>{data.range}</span>
          </li>
        ))}
    </ul>
  );
};
