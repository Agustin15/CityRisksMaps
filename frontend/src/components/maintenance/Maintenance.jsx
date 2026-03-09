import iconMaintenance from "../../assets/img/maintenance.png";
import { ErrorComponent } from "../errorComponent/ErrorComponent";

export const Maintenance = () => {
  return (
    <ErrorComponent
      title={"Sitio en mantenimiento"}
      msj={
        "¡Estamos trabajando en actualizaciones para brindarle la mejor experiencia posible!"
      }
      image={iconMaintenance}
    />
  );
};
