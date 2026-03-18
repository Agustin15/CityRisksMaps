import { useEffect } from "react";
import { useCrudContext } from "../../../../contexts/adminContext/CrudContext";
const localhostBackend = import.meta.env.VITE_LOCALHOST_BACKEND;

export const LoadData = ({
  setDepartments,
  setPages,
  setError,
  setLoading
}) => {
  const { fetchGet } = useCrudContext();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    let url = localhostBackend + "/departments/";
    let params = JSON.stringify({ option: "getDepartments" });

    const departments = await fetchGet(
      url + params,
      "GET",
      setLoading,
      setError
    );
    if (departments) {
      setPages(Math.ceil(departments.length / 10));

      let params = JSON.stringify({
        option: "getDepartmentsOffset",
        offset: 0
      });

      const departmentsOffset = await fetchGet(
        url + params,
        "GET",
        setLoading,
        setError
      );
      if (departmentsOffset) setDepartments(departments);
    }
  };
};
