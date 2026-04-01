const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;
const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loadingProfile, setLoadingProfile] = useState();

  const getProfile = async () => {
    setLoadingProfile(true);

    try {
      const response = await fetch(LOCALHOST_BACKEND + "/profile/", {
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
        } else if (response.status == 403)
          location.href = LOCALHOST_FRONTEND + "/admin/permiso-denegado/";
      }

      setUser(result);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loadingProfile,
        getProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
