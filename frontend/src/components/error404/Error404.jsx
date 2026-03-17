import iconError404 from "../../assets/img/error404.png";
import { NoContentComponent } from "../noContentComponent/NoContentComponent";

export const Error404 = () => {
  return (
    <NoContentComponent
      title={"Error 404"}
      msj={"La pagina solicitada no se encontro en el servidor"}
      image={iconError404}
    />
  );
};
