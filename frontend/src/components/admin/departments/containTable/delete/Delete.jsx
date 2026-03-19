import { useEffect } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import {
  alertSwalConfirmDelete,
  alertSwalSuccess
} from "../../../../sweetAlert/sweetAlert";

export const Delete = ({ department, setDeleteDepartment }) => {
  const { fetchDelete, fetchGet, index, setRegisters, registers, setPages } =
    useCrud();

  useEffect(() => {
    handleDelete();
  }, []);

  const handleDelete = async () => {
    const result = await alertSwalConfirmDelete(
      "Eliminar registro " + department.idDepartment,
      "¿Desea eliminar el registro " + department.name + "?"
    );

    if (result.isDismissed) {
      setDeleteDepartment(null);
    } else if (result.isConfirmed) {
      let url = "/departments/" + department.idDepartment;
      const result = await fetchDelete(url);
      if (result) {
        alertSwalSuccess("¡Departamento eliminado exitosamente!");
        reloadRegisters();
      }
    }
  };

  const reloadRegisters = async () => {
    if (registers.length == 1 && index > 0) {
      let url =
        "/departments/" +
        JSON.stringify({
          option: "getDepartments"
        });

      const departments = await fetchGet(url);

      if (departments) {
        setPages(Math.ceil(departments.length / 10));

        url =
          "/departments/" +
          JSON.stringify({
            option: "getDepartmentsOffset",
            offset: (index - 1) * 10
          });

        setRegisters(await fetchGet(url));
      }
    } else {
      let url =
        "/departments/" +
        JSON.stringify({
          option: "getDepartmentsOffset",
          offset: index * 10
        });
      setRegisters(await fetchGet(url));
    }
  };
};
