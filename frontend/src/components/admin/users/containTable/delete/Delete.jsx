import { useEffect } from "react";
import { useCrud } from "../../../../../contexts/adminContext/CrudContext";
import {
  alertSwalConfirmDelete,
  alertSwalSuccess
} from "../../../../sweetAlert/sweetAlert";

export const Delete = ({ user, setDeleteUser }) => {
  const {
    fetchDelete,
    fetchGet,
    setRegisters,
    registers,
    setPages,
    pages,
    setIndex,
    index
  } = useCrud();

  useEffect(() => {
    handleDelete();
  }, []);

  const handleDelete = async () => {
    const result = await alertSwalConfirmDelete(
      `¿Desea eliminar el registro de usuario ${user.name}?`
    );

    if (result.isDismissed) {
      setDeleteUser(null);
    } else if (result.isConfirmed) {
      let url = "/user/" + user.idUser;

      const result = await fetchDelete(url);
      if (result) {
        alertSwalSuccess("¡Usuario eliminado exitosamente!");
        reloadRegisters();
      }
    }
  };
  const reloadRegisters = async () => {
    let url;

    if (registers.length == 1 && index > 0) {
      url = "/user/usersOffset" + (index - 1) * 10;
    } else {
      url = "/user/usersOffset" + index * 10;
    }

    let users = await fetchGet(url);
    if (users) {
      setRegisters(users.registersOffset);

      if (users.pages < pages) {
        setPages(users.pages);
        setIndex(index - 1);
      }
    }
  };
};
