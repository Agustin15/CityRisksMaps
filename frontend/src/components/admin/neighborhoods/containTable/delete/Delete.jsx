import { useEffect } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { useParams } from "react-router";
import {
  alertSwalConfirmDelete,
  alertSwalSuccess
} from "../../../../sweetAlert/sweetAlert";
import { defineEndpointToRefreshDataAfterChanges } from "../functions.js";

export const Delete = ({ neighborhood, setDeleteNeighborhood }) => {
  const {
    fetchDelete,
    fetchGet,
    index,
    setIndex,
    setRegisters,
    setPages,
    pages
  } = useCrud();
  const params = useParams();

  useEffect(() => {
    handleDelete();
  }, []);

  const handleDelete = async () => {
    const result = await alertSwalConfirmDelete(
      `¿Desea eliminar el registro del barrio
        ${neighborhood.nameNeighborhood}?`
    );

    if (result.isDismissed) {
      setDeleteNeighborhood(null);
    } else if (result.isConfirmed) {
      let url = "/neighborhood/" + neighborhood.idNeighborhood;
      const result = await fetchDelete(url);

      if (result) {
        alertSwalSuccess("¡Registro de barrio eliminado exitosamente!");
        reloadRegisters();
      }
    }
  };

  const reloadRegisters = async () => {
    let url = defineEndpointToRefreshDataAfterChanges(index, params);

    let neighborhoods = await fetchGet(url);
    if (neighborhoods) {
      setRegisters(neighborhoods.registersOffset);
      if (neighborhoods.pages < pages) {
        setPages(neighborhoods.pages);
        setIndex(index - 1);
      }
    }
  };
};
