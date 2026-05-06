const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;

export const loadData = async (url, setUser) => {
  try {
    const response = await fetch(url, {
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
    }

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
