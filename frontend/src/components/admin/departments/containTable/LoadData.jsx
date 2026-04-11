import { useEffect } from "react";
import { useCrud } from "../../../../contexts/adminContext/CrudContext";

export const LoadData = ({ route, offset }) => {
  const { fetchGet, setRegisters, setPages, yearSelected, crimeSelected } =
    useCrud();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    let url =
      route +
      (crimeSelected ? "/" + crimeSelected : "") +
      (yearSelected ? "/" + yearSelected : "") +
      (offset >= 0 ? "/" + offset : "");

    const registers = await fetchGet(url);

    if (registers) {
      if (registers.pages) setPages(registers.pages);

      if (registers.registersOffset) setRegisters(registers.registersOffset);
      else setRegisters(registers);
    }
  };
};
