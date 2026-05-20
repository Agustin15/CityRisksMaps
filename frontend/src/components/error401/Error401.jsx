import iconError401 from "../../assets/img/error401.png";
import { NoContentComponent } from "../noContentComponent/NoContentComponent";

export const Error401 = () => {
  return (
    <NoContentComponent
      title={"Sin autorizacion"}
      msj={"No tiene autorización para acceder a esta recurso"}
      image={iconError401}
    />
  );
};
