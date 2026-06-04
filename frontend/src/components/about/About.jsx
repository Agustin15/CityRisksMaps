import styles from "./About.module.css";

export const About = () => {
  return (
    <div className={styles.about}>
      <div className={styles.row}>
        <div className={styles.circle}></div>
        <div className={styles.description}>
          <h4>About us</h4>
          <p>
            Esta plataforma tiene como objetivo facilitar el acceso, la
            visualización y el análisis de información territorial de Montevideo
            mediante mapas interactivos y herramientas de exploración de datos.
            El sitio integra información geográfica, indicadores y estadísticas
            provenientes de la{" "}
            <a href="https://catalogodatos.gub.uy/dataset/ministerio-del-interior-delitos_denunciados_en_el_uruguay">
              Área de Estadística y Criminología Aplicada (AECA){" "}
            </a>
            .
          </p>
          <p>
            A través de visualizaciones intuitivas, los usuarios pueden comparar
            zonas de la ciudad y obtener una mejor comprensión de la realidad
            local. La plataforma está dirigida a investigadores, ciudadanos
            interesados, estudiantes, organismos públicos.
          </p>
          <p>
            Nuestro propósito es contribuir a una mayor transparencia,
            accesibilidad y aprovechamiento de la información territorial,
            acercando los datos a la comunidad de una manera clara y sencilla.
          </p>
        </div>
      </div>
    </div>
  );
};
