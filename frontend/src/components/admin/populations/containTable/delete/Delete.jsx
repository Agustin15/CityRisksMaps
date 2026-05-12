import { useEffect } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import { useNavigate, useParams } from "react-router";
import {
  alertSwalConfirmDelete,
  alertSwalSuccess
} from "../../../../sweetAlert/sweetAlert";

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

    if (registers.length == 1) {
      if (index == 0) {
        const yearsLoaded = await loadYears("/population/populationsYears");
        
        if (!yearsLoaded || yearsLoaded.length == 0) return;

        const yearToSelect = Math.max(...yearsLoaded);
        setYearSelected(yearToSelect);
        url = "/population/populationsOffsetYear/" + yearToSelect + "/" + 0;
      } else {
        url =
          "/population/populationsOffsetYear/" +
          yearSelected +
          "/" +
          (index - 1) * 10;
      }
    } else {
      url =
        "/population/populationsOffsetYear/" + yearSelected + "/" + index * 10;
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
