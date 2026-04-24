const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;

export const fetchUpdate = async (avatar, idUser, setUser) => {
  try {
    const formData = new FormData();
    formData.append("avatar", avatar);

    const response = await fetch(
      LOCALHOST_BACKEND + "/profile/avatar/" + idUser,
      {
        method: "PUT",
        credentials: "include",
        body: formData
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

    return result;
  } catch (error) {
    throw error;
  }
};

export const fetchDelete = async (idUser, avatarId) => {
  try {
    const response = await fetch(
      LOCALHOST_BACKEND +
        "/profile/avatar/" +
        idUser +
        "/delete/" +
        encodeURIComponent(avatarId),
      {
        method: "PUT",
        credentials: "include"
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
    return result;
  } catch (error) {
    throw error;
  }
};
