import { useEffect } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import {
  alertSwalConfirmDelete,
  alertSwalSuccess
} from "../../../../sweetAlert/sweetAlert.js";

export const Delete = ({ neighborhoodCrime, setDeleteItem }) => {
  const {
    fetchDelete,
    fetchGet,
    setRegisters,
    registers,
    setPages,
    setIndex,
    index,
    loadYears,
    setYearSelected,
    yearSelected
  } = useCrud();

  useEffect(() => {
    handleDelete();
  }, []);

  const handleDelete = async () => {
    const result = await alertSwalConfirmDelete(
      `¿Desea eliminar los registros de ${neighborhoodCrime.crime} 
      en ${neighborhoodCrime.name} de ${yearSelected}?`
    );

    if (result.isDismissed) {
      setDeleteItem(null);
    } else if (result.isConfirmed) {
      const idCompound = JSON.stringify({
        idNeighborhood: neighborhoodCrime.neighborhood,
        year: yearSelected,
        crime: neighborhoodCrime.crime
      });

      let url = "/neighborhoodCrime/" + idCompound;

      const result = await fetchDelete(url);
      if (result) {
        alertSwalSuccess(
          "¡Registro de crimen en barrio eliminada exitosamente!"
        );
        reloadRegisters();
      }
    }
  };
  const reloadRegisters = async () => {
    let url =
      "/neighborhoodCrime/neighborhoodsCrimesByYearOffset/" +
      neighborhoodCrime.crime;

    if (registers.length == 1) {
      if (index == 0) {
        const yearsLoaded = await loadYears(
          "/neighborhoodCrime/yearsNeighborhoodsCrime" + neighborhoodCrime.crime
        );

        if (!yearsLoaded || yearsLoaded.length == 0) return;
        const yearToSelect = Math.max(...yearsLoaded);

        setYearSelected(yearToSelect);
        url += "/" + yearToSelect + "/" + 0;
      } else {
        url += "/" + yearSelected + "/" + (index - 1) * 10;
      }
    } else {
      url += "/" + yearSelected + "/" + index * 10;
    }

    let result = await fetchGet(url);
    if (result) {
      setRegisters(result.registersOffset);
      if (result.pages < pages) {
        setPages(result.pages);
        setIndex(index - 1);
      }
    }
  };
};
