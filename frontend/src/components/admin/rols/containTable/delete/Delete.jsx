import { useEffect } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import {
  alertSwalConfirmDelete,
  alertSwalSuccess
} from "../../../../sweetAlert/sweetAlert";

export const Delete = ({ role, setDeleteRole }) => {
  const { fetchDelete, fetchGet, setRegisters } = useCrud();

  useEffect(() => {
    handleDelete();
  }, []);

  const handleDelete = async () => {
    const result = await alertSwalConfirmDelete(
      `¿Desea eliminar el registro de rol ${role.name}?`
    );

    if (result.isDismissed) {
      setDeleteRole(null);
    } else if (result.isConfirmed) {
      let url = "/role/" + role.idRol;

      const result = await fetchDelete(url);
      if (result) {
        alertSwalSuccess("¡Rol eliminado exitosamente!");
        reloadRegisters();
      }
    }
  };
  const reloadRegisters = async () => {
    let url = "/role/allRols";
    
    let rols = await fetchGet(url);
    if (rols) {
      setRegisters(rols);
    }
  };
};
