import { useEffect } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import {
  alertSwalConfirmDelete,
  alertSwalSuccess
} from "../../../../sweetAlert/sweetAlert";

export const Delete = ({ department, setDeleteDepartment }) => {
  const {
    fetchDelete,
    fetchGet,
    setIndex,
    index,
    setRegisters,
    setPages,
    pages
  } = useCrud();

  useEffect(() => {
    handleDelete();
  }, []);

  const handleDelete = async () => {
    const result = await alertSwalConfirmDelete(
      `¿Desea eliminar el registro ${department.name }?`
    );

    if (result.isDismissed) {
      setDeleteDepartment(null);
    } else if (result.isConfirmed) {
      let url = "/department/" + department.idDepartment;
      const result = await fetchDelete(url);
      if (result) {
        alertSwalSuccess("¡Departamento eliminado exitosamente!");
        reloadRegisters();
      }
    }
  };
  const reloadRegisters = async () => {
    let url =
      "/department/" +
      JSON.stringify({
        option: "getDepartmentsOffset",
        offset: index * 10
      });

    let departments = await fetchGet(url);
    if (departments) {
      setRegisters(departments.registersOffset);
      if (departments.pages < pages) {
        setPages(departments.pages);
        setIndex(index - 1);
      }
    }
  };
};
