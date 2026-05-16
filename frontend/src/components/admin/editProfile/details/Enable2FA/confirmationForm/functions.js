import { alertSwalSuccess } from "../../../../../sweetAlert/sweetAlert.js";
const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;
const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;

export const fetchUpdateStateAuth2FA = async (
  isEnabled,
  user,
  setUser,
  password
) => {
  try {
    const response = await fetch(
      LOCALHOST_BACKEND + "/user/stateAuth2FA/" + user.idUser,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          state: isEnabled ? 0 : 1,
          password: password
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      if (response.status == 401) {
        setUser();
        location.href = LOCALHOST_FRONTEND + "/admin/login";
      } else throw new Error(result.messageError);
    }

    if (result) {
      setUser({ ...user, auth2FA: result.newState });
      alertSwalSuccess(
        `Autenticacion de dos pasos ${result.newState ? "habilitada" : "deshabilitada"} exitosamente`
      );
    }
  } catch (error) {
    throw error;
  }
};
