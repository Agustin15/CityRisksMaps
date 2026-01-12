import styles from "./References.module.css";

export const References = () => {
  const references = [
    { range: "0%-39%", color: "#f73d1cff" },
    { range: "40%-59%", color: " #fa7c06ff" },
    { range: "60%-79%", color: "#f1f134ff" },
    { range: "MAS DE 80% ", color: "#ffffbfff" }
  ];

  return (
    <div className={styles.references}>
      <h4>Referencias de tasas de denuncias:</h4>
      <ul className={styles.ulReferences}>
        {references &&
          references.map((data, index) => (
            <li key={index}>
              <div style={{ backgroundColor: data.color }}></div>
              <span>{data.range}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};
