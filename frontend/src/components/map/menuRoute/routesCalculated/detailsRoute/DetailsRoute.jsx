import styles from "./DetailsRoute.module.css";

export const DetailsRoute = ({ steps }) => {
  return (
    <ul className={styles.details}>
      {steps.map((step, index) => (
        <li
          key={index}
          className={
            index % 2 == 0 ? styles.itemDetailGray : styles.itemDetailWhite
          }
        >
          <p>{step.navigationInstruction.instructions}</p>

          <div className={styles.detailsInstruction}>
            <span className={styles.duration}>
              {step.localizedValues.staticDuration.text}
            </span>
            {step.localizedValues.distance.text}
          </div>
        </li>
      ))}
    </ul>
  );
};
