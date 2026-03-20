import Swal from "sweetalert2";
import iconGeolocation from "../../assets/img/failedGeolocation.png";
import styles from "./sweetalert.module.css";

export const alertSwalError = (title, error) => {
  Swal.fire({
    title: title,
    html: `
    <p class=${styles.customMsj}>${error}</p>
    `,
    imageUrl: iconGeolocation,
    customClass: {
      popup: styles.popup,
      image: styles.image,
      title: styles.title,
      confirmButton: styles.btnConfirm
    }
  });
};

export const alertSwalWarning = (error) => {
  Swal.fire({
    title: "¡Advertencia!",
    html: `
    <p class=${styles.customMsj}>${error}</p>
    `,
    icon: "warning",
    customClass: {
      popup: styles.popup,
      icon: styles.icon,
      title: styles.title,
      confirmButton: styles.btnConfirmWarning
    }
  });
};

export const alertSwalSuccess = (msj) => {
  Swal.fire({
    title: "¡Exito!",
    html: `
    <p class=${styles.customMsj}>${msj}</p>
    `,
    icon: "success",
    customClass: {
      popup: styles.popup,
      icon: styles.icon,
      title: styles.title,
      confirmButton: styles.btnConfirmSuccess
    }
  });
};

export const alertSwalErrorAdmin = (title, error) => {
  Swal.fire({
    icon: "error",
    title: title,
    html: `
    <p class=${styles.customMsj}>${error}</p>
    `,
    customClass: {
      popup: styles.popup,
      image: styles.image,
      title: styles.title,
      confirmButton: styles.btnConfirm
    }
  });
};
export const alertSwalConfirmDelete = async (title) => {
  const result = await Swal.fire({
    icon: "question",
    title: title,
    showCancelButton:true,
    cancelButtonText:"Cancelar",
    confirmButtonText:"Confimar",
    customClass: {
      popup: styles.popup,
      image: styles.image,
      title: styles.title,
      confirmButton: styles.btnConfirm,
      cancelButton: styles.btnCancel
    }
  });

  return result;
};
