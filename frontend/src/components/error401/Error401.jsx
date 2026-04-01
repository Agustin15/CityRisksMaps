import iconError401 from "../../assets/img/error401.png";
import { NoContentComponent } from "../noContentComponent/NoContentComponent";

export const Error401 = () => {
  return (
    <NoContentComponent
      title={"ERROR 401"}
      msj={"No tiene autorización para acceder a esta pagina"}
      image={iconError401}
    />
  );
};
