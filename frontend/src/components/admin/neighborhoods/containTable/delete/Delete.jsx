import { useEffect } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import {
  alertSwalConfirmDelete,
  alertSwalSuccess
} from "../../../../sweetAlert/sweetAlert";

export const Delete = ({ neighborhood, setDeleteNeighborhood }) => {
  const {
    fetchDelete,
    fetchGet,
    index,
    setRegisters,
    registers,
    setPages,
    page
  } = useCrud();

  useEffect(() => {
    handleDelete();
  }, []);

  const handleDelete = async () => {
    const result = await alertSwalConfirmDelete(
      "¿Desea eliminar el registro del barrio " +
        neighborhood.nameNeighborhood +
        "?"
    );

    if (result.isDismissed) {
      setDeleteNeighborhood(null);
    } else if (result.isConfirmed) {
      let url = "/neighborhood/" + neighborhood.nameNeighborhood;
      const result = await fetchDelete(url);

      if (result) {
        alertSwalSuccess("¡Barrio eliminado exitosamente!");
        reloadRegisters();
      }
    }
  };

  const reloadRegisters = async () => {
    if (registers.length == 1 && index > 0) {
      url =
        "/neighborhood/" +
        JSON.stringify({
          option: "getNeighborhoodsOffset",
          offset: (index - 1) * 10
        });

      setPages(page - 1);
      setRegisters(await fetchGet(url));
    } else {
     
      let url =
        "/neighborhood/" +
        JSON.stringify({
          option: "getNeighborhoodsOffset",
          offset: index * 10
        });
      setRegisters(await fetchGet(url));
    }
  };
};
