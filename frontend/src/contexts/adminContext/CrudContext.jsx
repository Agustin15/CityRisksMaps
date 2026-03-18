import { createContext, useContext } from "react";
const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;

const CrudContext = createContext();

export const CrudProvider = ({ children }) => {
  const fetchGet = async (url, methodFetch, setLoading, setError) => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: methodFetch,
        credentials: "include",
        headers: {
          "Content-type": "application/json"
        }
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status == 401)
          location.href = LOCALHOST_FRONTEND + "/admin";
        else throw new Error(result.messageError);
      }

      return result;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CrudContext.Provider value={{ fetchGet }}>{children}</CrudContext.Provider>
  );
};

export const useCrudContext = () => useContext(CrudContext);
