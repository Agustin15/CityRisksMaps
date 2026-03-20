import { useEffect } from "react";
import { useCrud } from "../../../../contexts/adminContext/CrudContext";

export const LoadData = ({ route, controller, controllerOffset }) => {
  const { fetchGet, setRegisters, setPages } = useCrud();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    let url = route + JSON.stringify({ option: controller });

    const registers = await fetchGet(url, "GET");

    if (registers) {
      setPages(Math.ceil(registers.length / 10));

      let url =
        route +
        JSON.stringify({
          option: controllerOffset,
          offset: 0
        });

      const registersOffset = await fetchGet(url, "GET");
      if (registersOffset) setRegisters(registersOffset);
    }
  };
};
