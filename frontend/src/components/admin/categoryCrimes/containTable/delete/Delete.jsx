import { useEffect } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import {
  alertSwalConfirmDelete,
  alertSwalSuccess
} from "../../../../sweetAlert/sweetAlert";

export const Delete = ({ crime, setDeleteCrime }) => {
  const { fetchDelete, fetchGet, setRegisters } = useCrud();

  useEffect(() => {
    handleDelete();
  }, []);

  const handleDelete = async () => {
    const result = await alertSwalConfirmDelete(
      `¿Desea eliminar el registro ${crime.category}?`
    );

    if (result.isDismissed) {
      setDeleteCrime(null);
    } else if (result.isConfirmed) {
      let url = "/crime/" + crime.category;

      const result = await fetchDelete(url);
      if (result) {
        alertSwalSuccess("¡Categoria eliminada exitosamente!");
        reloadRegisters();
      }
    }
  };
  const reloadRegisters = async () => {
    let url = "/crime/crimes";
    let crimes = await fetchGet(url);
    if (crimes) {
      setRegisters(crimes);
    }
  };
};
