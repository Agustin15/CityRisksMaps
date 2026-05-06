import iconMaintenance from "../../assets/img/maintenance.png";
import { NoContentComponent } from "../noContentComponent/NoContentComponent";
import { Helmet } from "react-helmet-async";

export const Maintenance = () => {
  return (
    <NoContentComponent
      title={"Sitio en mantenimiento"}
      msj={
        "¡Estamos trabajando en actualizaciones para brindarle la mejor experiencia posible!"
      }
      image={iconMaintenance}
    />
  );
};
