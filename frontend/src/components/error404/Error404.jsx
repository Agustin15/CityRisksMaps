import iconError404 from "../../assets/img/error404.png";
import { ErrorComponent } from "../errorComponent/ErrorComponent";

export const Error404 = () => {
  return (
    <ErrorComponent
      title={"Error 404"}
      msj={"La pagina solicitada no se encontro en el servidor"}
      image={iconError404}
    />
  );
};
