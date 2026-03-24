import { useEffect } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { useNavigate, useParams } from "react-router";
import {
  alertSwalConfirmDelete,
  alertSwalSuccess
} from "../../../../sweetAlert/sweetAlert";
import { defineEndpointToRefreshDataAfterChanges } from "../functions.js";

export const Delete = ({ population, setDeletePopulation }) => {
  const {
    fetchDelete,
    fetchGet,
    loadYears,
    index,
    setIndex,
    setRegisters,
    setPages,
    pages,
    registers,
    setYearSelected,
    yearSelected
  } = useCrud();
  const params = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    handleDelete();
  }, []);

  const handleDelete = async () => {
    const result = await alertSwalConfirmDelete(
      `¿Desea eliminar el registro de la poblacion de
        ${population.nameNeighborhood} del año
        ${population.year}? `
    );

    if (result.isDismissed) {
      setDeletePopulation(null);
    } else if (result.isConfirmed) {
      let url = "/population/" + population.idPopulation;
      const result = await fetchDelete(url);

      if (result) {
        alertSwalSuccess("¡Registro de poblacion eliminado exitosamente!");
        reloadRegisters();
      }
    }
  };

  const reloadRegisters = async () => {
    let url;
    if (index == 0 && registers.length == 1) {
      const yearsLoaded = await loadYears(
        "/population/",
        "getPopulationsYears"
      );

      const yearToSelect = Math.max(...yearsLoaded);
      setYearSelected(yearToSelect);
      url = defineEndpointToRefreshDataAfterChanges(0, params, yearToSelect);
    } else {
      url = defineEndpointToRefreshDataAfterChanges(
        index,
        params,
        yearSelected
      );
    }

    let populations = await fetchGet(url);
    if (populations) {
      setRegisters(populations.registersOffset);
      setPages(populations.pages);
      if (populations.pages < pages) {
        setIndex(index - 1);
      }
    }
  };
};
