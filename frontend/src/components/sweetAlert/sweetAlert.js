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
    width: 460,
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
    width: 460,
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
    width: 420,
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
    width: 420,
    customClass: {
      title: styles.customTitle,
      confirmButton: styles.customBtnConfirmSuccess
    }
  });
};
