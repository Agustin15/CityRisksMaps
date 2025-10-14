import Swal from "sweetalert2";
import iconGeolocation from "../../assets/img/failedGeolocation.png";
import styles from "./sweetalert.module.css";

export const alertSwalError = (title,error) => {
  Swal.fire({
    title: title,
    html: `
    <p class=${styles.customMsj}>${error}</p>
    `,
    imageUrl: iconGeolocation,
    imageWidth: 70,
    imageHeight: 70,
    width:460,
    customClass: {
      title: styles.customTitle,
      confirmButton: styles.customBtnConfirm
    }
  });
};
