const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;
const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;

export const loadData = async (endpoint, setUser) => {
  try {
    const response = await fetch(LOCALHOST_BACKEND + endpoint, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-type": "application/json"
      }
    });

    const result = await response.json();
    if (!response.ok) {
      if (response.status == 401) {
        setUser();
        location.href = LOCALHOST_FRONTEND + "/admin/login";
      }
      throw new Error(result.messageError || "Error en la solicitud");
    }

    return result;
  } catch (error) {
    throw error;
  }
};
