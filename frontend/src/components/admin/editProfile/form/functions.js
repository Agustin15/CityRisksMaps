const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
import { alertSwalErrorAdmin } from "../../../sweetAlert/sweetAlert.js";

export const fetchUpdateCompleteName = async (
  setLoading,
  setUser,
  values,
  idUser
) => {
  try {
    setLoading(true);
    const response = await fetch(
      LOCALHOST_BACKEND + "/profile/updateCompleteName/" + idUser,
      {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(values),
        headers: {
          "Content-type": "application/json"
        }
      }
    );

    const result = await response.json();

    if (!response.ok) {
      if (response.status == 401) {
        setUser();
        location.href = LOCALHOST_FRONTEND + "/admin/login";
      }
      throw new Error(result.messageError);
    }

    return true;
  } catch (error) {
    alertSwalErrorAdmin(
      "Ups, no se pudieron actualizar los datos del usuario",
      error.message
    );
  } finally {
    setLoading(false);
  }
};
