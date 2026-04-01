import { useEffect } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { useParams } from "react-router";
import {
  alertSwalConfirmDelete,
  alertSwalSuccess
} from "../../../../sweetAlert/sweetAlert";

export const Delete = ({ neighborhood, setDeleteNeighborhood }) => {
  const {
    fetchDelete,
    fetchGet,
    index,
    setIndex,
    registers,
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
    let url;
    if (registers.length == 1 && index > 0) {
      url = "/neighborhood/neighborhoodsOffset/" + (index - 1) * 10;
    } else {
      url = "/neighborhood/neighborhoodsOffset/" + index * 10;
    }

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
