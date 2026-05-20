const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;

export const fetchVerifyAllowToAccess = async (setLoading) => {
  try {
    const response = await fetch(LOCALHOST_BACKEND + "/admin/login/", {
      method: "GET"
    });

    const result = response.json();

    if (!response.ok) {
      if (response.status == 403)
        location.href = LOCALHOST_FRONTEND + "/admin/permiso-denegado";
      else throw new Error(result.messageError);
    }
  } catch (error) {
    throw error;
  } finally {
    setLoading(false);
  }
};
