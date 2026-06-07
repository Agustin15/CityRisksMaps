import styles from "./About.module.css";
import iconAboutUs from "../../assets/img/aboutUs.gif";
import iconLogo from "../../assets/img/logo.png";
import { Questions } from "./questions/Questions";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export const About = () => {
  let navigate = useNavigate();

  useEffect(() => {
    document.querySelector("body").style.overflowY = "scroll";
  }, []);

  return (
    <div className={styles.about}>
      <nav className={styles.navbar}>
        <ul>
          <li>
            <img src={iconLogo}></img>
            <h3>IndiceDelitosMontevideo</h3>
          </li>
          <li>
            <button onClick={() => navigate("/")}>Volver al mapa</button>
          </li>
        </ul>
      </nav>

      <div className={styles.row}>
        <div className={styles.icon}>
          <img src={iconAboutUs}></img>
        </div>
        <div className={styles.description}>
          <h4>Acerca de IndiceDelitosMontevideo</h4>
          <p>
            Esta plataforma tiene como objetivo facilitar el acceso, la
            visualización y el análisis de información territorial de Montevideo
            mediante mapas interactivos y herramientas de exploración de datos.
            El sitio integra información geográfica, indicadores y estadísticas
            provenientes de la Área de Estadística y Criminología Aplicada
            (AECA) .
          </p>
          <p>
            A través de visualizaciones intuitivas, los usuarios pueden comparar
            zonas de la ciudad y obtener una mejor comprensión de la realidad
            local. La plataforma está dirigida a investigadores, ciudadanos
            interesados, estudiantes, organismos públicos.
          </p>
          <p>
            El propósito es contribuir a una mayor transparencia, accesibilidad
            y aprovechamiento de la información territorial, acercando los datos
            a la comunidad de una manera clara y sencilla.
          </p>
          <div className={styles.credits}>
            <h4>Creditos y fuentes</h4>
            <li>
              <span>
                Api de Google Maps:
                <a href="https://mapsplatform.google.com/lp/maps-apis/">
                  {" "}
                  Link
                </a>
              </span>
            </li>
            <li>
              <span>
                Área de Estadística y Criminología Aplicada (AECA):
                <a href="https://catalogodatos.gub.uy/dataset/ministerio-del-interior-delitos_denunciados_en_el_uruguay">
                  Link
                </a>
              </span>
            </li>
            <li>
              <span>
                Geojson de barrios de Montevideo:
                <a href="https://github.com/vierja/geojson_montevideo"> Link</a>
              </span>
            </li>
          </div>
        </div>
      </div>

      <footer>
        <ul className={styles.links}>
          <li>
            <span>Links rapidos</span>
          </li>
          <li>
            <a href="/">Volver al mapa</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
        </ul>
        <Questions />

        <p className={styles.author}>
          © IndiceDelitosMontevideo 2026 | Desarrollado por{" "}
          <a href="https://www.linkedin.com/in/agustin-miranda-953634239">
            Agustin Miranda
          </a>
        </p>
      </footer>
    </div>
  );
};
