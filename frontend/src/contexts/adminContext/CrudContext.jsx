const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;
const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
import { createContext, useContext, useState } from "react";
import { alertSwalErrorAdmin } from "../../components/sweetAlert/sweetAlert.js";
import { useAuth } from "./AuthContext.jsx";

const CrudContext = createContext();

export const CrudProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingFilter, setLoadingFilter] = useState(false);
  const [registers, setRegisters] = useState();
  const [years, setYears] = useState();
  const [crimes, setCrimes] = useState();
  const [elementNotFound, setElementNotFound] = useState(false);
  const [pages, setPages] = useState();
  const [index, setIndex] = useState(0);
  const [yearSelected, setYearSelected] = useState();
  const [crimeSelected, setCrimeSelected] = useState();
  const [error, setError] = useState();
  const { setUser } = useAuth();

  const fetchGet = async (url, setLoadingFilter) => {
    setError();

    if (!setLoadingFilter) setLoading(true);
    else setLoadingFilter(true);

    try {
      const response = await fetch(LOCALHOST_BACKEND + url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json"
        }
      });

      const result = await response.json();

      if (!response.ok) {
        failedResponse(response, result);
      }

      return result;
    } catch (error) {
      setError(error.message);
    } finally {
      if (!setLoadingFilter) setLoading(false);
      else setLoadingFilter(false);
    }
  };

  const fetchPostOrPut = async (url, methodFetch, setLoading, body) => {
    setLoading(true);
    try {
      const response = await fetch(LOCALHOST_BACKEND + url, {
        method: methodFetch,
        credentials: "include",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (!response.ok) {
        failedResponse(response, result);
      }

      return result;
    } catch (error) {
      alertSwalErrorAdmin(
        `
        Ups,hubo un error al
          ${
            methodFetch == "PUT"
              ? "actualizar el registro"
              : "dar de alta el registro"
          }`,
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPostWithFormData = async (url, setLoading, formData) => {
    setLoading(true);
    try {
      const response = await fetch(LOCALHOST_BACKEND + url, {
        method: "POST",
        credentials: "include",
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        failedResponse(response, result);
      }

      return result;
    } catch (error) {
      alertSwalErrorAdmin(
        "Ups,hubo un error al dar de alta los registros",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchDelete = async (url) => {
    setLoading(true);
    try {
      const response = await fetch(LOCALHOST_BACKEND + url, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-type": "application/json"
        }
      });

      const result = await response.json();

      if (!response.ok) {
        failedResponse(response, result);
      }

      return result;
    } catch (error) {
      alertSwalErrorAdmin(
        "Ups,hubo un error al dar de baja el registro",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const failedResponse = (response, result) => {
    if (response.status == 401) {
      setUser();
      location.href = LOCALHOST_FRONTEND + "/admin/login";
    } else throw new Error(result.messageError);
  };

  const loadYears = async (url) => {
    const yearsFound = await fetchGet(url, setLoadingFilter);
    if (yearsFound) {
      let yearsFormatted = yearsFound.map((year) => Object.values(year));
      setYears(yearsFormatted);
      setYearSelected(yearsFormatted[0]);
      return yearsFormatted;
    } else {
      setYears();
      setYearSelected();
    }
  };

  const searcher = (value) => {
    const table = document.querySelector("table");
    if (!table) return;

    const tbody = table.querySelector("tbody");
    const rows = [...tbody.querySelectorAll("tr")];

    if (!registers || registers.length == 0) return;

    rows.map((row) => {
      if (row.textContent.toLowerCase().indexOf(value.toLowerCase()) == -1)
        row.style.display = "none";
      else row.style.display = "table-row";
    });

    const rowsHidden = rows.filter((row) => row.style.display == "none");

    if (rowsHidden.length == rows.length) setElementNotFound(true);
    else setElementNotFound(false);
  };

  return (
    <CrudContext.Provider
      value={{
        fetchGet,
        fetchPostOrPut,
        fetchPostWithFormData,
        fetchDelete,
        loadYears,
        searcher,
        setLoadingFilter,
        loadingFilter,
        loading,
        registers,
        setRegisters,
        index,
        setIndex,
        pages,
        setPages,
        yearSelected,
        setYearSelected,
        crimes,
        setCrimes,
        years,
        crimeSelected,
        setCrimeSelected,
        error,
        elementNotFound
      }}
    >
      {children}
    </CrudContext.Provider>
  );
};

export const useCrud = () => useContext(CrudContext);
