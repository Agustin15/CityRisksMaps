import styles from "./Enable2FA.module.css";
import iconAuth2FA from "../../../../../assets/img/auth2FA.png";
import { useAuth } from "../../../../../contexts/adminContext/AuthContext";
import { useState } from "react";
import { ConfirmationForm } from "./confirmationForm/ConfirmationForm";
import { Modal } from "../../../modal/Modal";
import { createPortal } from "react-dom";

export const Enable2FA = () => {
  const { user } = useAuth();
  const [show2FAForm, setShow2FAForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShow2FAForm(true)}
        className={
          user.auth2FA ? styles.btnAuth2FA : styles.btnAuth2FA
        }
      >
        <img src={iconAuth2FA}></img>
        {!user.auth2FA ? "Habilitar" : "Deshabilitar"} 2FA
      </button>

      {show2FAForm &&
        createPortal(
          <Modal>
            <ConfirmationForm setShow2FAForm={setShow2FAForm} />
          </Modal>,
          document.body
        )}
    </>
  );
};
