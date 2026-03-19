import { useEffect } from "react";
import { useCrud } from "../../../../contexts/adminContext/CrudContext";

export const LoadData = () => {
  const { fetchGet, setRegisters, setPages } = useCrud();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    let url = "/departments/" + JSON.stringify({ option: "getDepartments" });

    const departments = await fetchGet(url, "GET");

    if (departments) {
      setPages(Math.ceil(departments.length / 10));

      let url =
        "/departments/" +
        JSON.stringify({
          option: "getDepartmentsOffset",
          offset: 0
        });

      const departmentsOffset = await fetchGet(url, "GET");
      if (departmentsOffset) setRegisters(departments);
    }
  };
};
