const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;
const LOCALHOST_BACKEND = import.meta.env.VITE_LOCALHOST_BACKEND;
import { createContext, useContext, useState } from "react";
import { alertSwalErrorAdmin } from "../../components/sweetAlert/sweetAlert.js";
import { useCookies } from "react-cookie";

const CrudContext = createContext();

export const CrudProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);
  const [registers, setRegisters] = useState();
  const [years, setYears] = useState();
  const [elementNotFound, setElementNotFound] = useState(false);
  const [pages, setPages] = useState();
  const [index, setIndex] = useState(0);
  const [yearSelected, setYearSelected] = useState();
  const [error, setError] = useState();
  const [cookies, setCookie, removeCookie] = useCookies();

  const fetchGet = async (url, setLoadingYears) => {
    setError();

    if (!setLoadingYears) setLoading(true);
    else setLoadingYears(true);

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
      if (!setLoadingYears) setLoading(false);
      else setLoadingYears(false);
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
      removeCookie("nameAndLastname");
      location.href = LOCALHOST_FRONTEND + "/admin/login";
    } else throw new Error(result.messageError);
  };

  const loadYears = async (route, controller) => {
    let url = route + JSON.stringify({ option: controller });

    const yearsFound = await fetchGet(url, setLoadingYears);
    if (yearsFound) {
      let yearsFormatted = yearsFound.map((year) => Object.values(year));
      setYearSelected(yearSelected ? yearSelected : yearsFormatted[0]);
      setYears(yearsFormatted);

      return yearsFormatted;
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
        fetchDelete,
        loadYears,
        searcher,
        loadingYears,
        loading,
        registers,
        setRegisters,
        index,
        setIndex,
        pages,
        setPages,
        yearSelected,
        setYearSelected,
        years,
        error,
        elementNotFound
      }}
    >
      {children}
    </CrudContext.Provider>
  );
};

export const useCrud = () => useContext(CrudContext);
