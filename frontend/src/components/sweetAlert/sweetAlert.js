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
    imageWidth: 70,
    imageHeight: 70,
    width: window.innerWidth <= 650 ? 420 : 460,
    customClass: {
      title: styles.customTitle,
      confirmButton: styles.customBtnConfirm
    }
  });
};

export const alertSwalErrorQuiz = (title, error) => {
  Swal.fire({
    title: title,
    icon: "error",
    html: `
    <p class=${styles.customMsj}>${error}</p>
    `,
    width: window.innerWidth <= 650 ? 420 : 460,
    customClass: {
      title: styles.customTitle,
      confirmButton: styles.customBtnConfirm
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
    width: window.innerWidth <= 650 ? 420 : 460,
    customClass: {
      title: styles.customTitle,
      confirmButton: styles.customBtnConfirmWarning
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
    width: window.innerWidth <= 650 ? 390 : 420,
    customClass: {
      title: styles.customTitle,
      confirmButton: styles.customBtnConfirmSuccess
    }
  });
};

export const alertSwalConfirmDeleteQuiz = async (msj) => {
  const result = await Swal.fire({
    title: "Eliminar encuesta",
    html: `
    <p class=${styles.customMsj}>${msj}</p>
    `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Si,eliminar",
    cancelButtonText: "No,cancelar",
    width: window.innerWidth <= 650 ? 390 : 420,
    customClass: {
      title: styles.customTitle,
      confirmButton: styles.customBtnConfirmSuccess,
      cancelButton: styles.customBtnConfirm
    }
  });

  return result;
};
