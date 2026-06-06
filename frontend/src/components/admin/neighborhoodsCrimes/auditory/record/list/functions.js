import iconDelete from "../../../../../../assets/img/deleteDML.png";
import iconInsert from "../../../../../../assets/img/insertDML.png";
import iconUpdate from "../../../../../../assets/img/updateDML.png";

export const defineIcon = (actionName) => {
  switch (actionName) {
    case "DELETE":
      return iconDelete;
    case "INSERT":
      return iconInsert;
    case "UPDATE":
      return iconUpdate;
  }
};

export const defineAction = (actionName) => {
  switch (actionName) {
    case "DELETE":
      return "Eliminacion";
    case "INSERT":
      return "Insercion";
    case "UPDATE":
      return "Actualizacion";
  }
};
