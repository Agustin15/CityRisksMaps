export const RoutesCalculated = ({ routes }) => {
  return (
    <ul className={styles.containRoutes}>
      {routes.map((route) => (
        <li></li>
      ))}
    </ul>
  );
};
