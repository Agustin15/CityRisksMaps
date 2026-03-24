import { useEffect } from "react";
import { useCrud } from "../../../../contexts/adminContext/CrudContext";
import { useParams } from "react-router";

export const LoadData = ({ route, controller }) => {
  const { fetchGet, setRegisters, setPages, yearSelected } = useCrud();
  let params = useParams();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    let url =
      route +
      JSON.stringify({
        option: controller,
        offset: 0,
        ...(yearSelected && {
          year: yearSelected
        }),
        ...(params && {
          id: params.id
        })
      });

    const registers = await fetchGet(url);

    if (registers) {
      setPages(registers.pages);
      setRegisters(registers.registersOffset);
    }
  };
};
