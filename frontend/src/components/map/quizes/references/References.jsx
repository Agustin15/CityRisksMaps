import styles from "./References.module.css";

export const References = () => {
  const references = [
    { range: "0%-19%:", color: "#ee2f29ff" },
    { range: "20%-39%", color: "#f7491eff" },
    { range: "40%-59%", color: "#f77963ff" },
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
