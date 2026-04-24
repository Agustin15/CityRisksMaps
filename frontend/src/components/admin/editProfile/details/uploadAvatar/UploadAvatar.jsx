const LOCALHOST_FRONTEND = import.meta.env.VITE_LOCALHOST_FRONTEND;
import styles from "./UploadAvatar.module.css";
import iconChangeAvatar from "../../../../../assets/img/changeAvatar.png";
import iconDeleteAvatar from "../../../../../assets/img/deleteAvatar.png";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../../../contexts/adminContext/AuthContext";
import { fetchDelete, fetchUpdate } from "./functions.js";
import { createPortal } from "react-dom";

export const UploadAvatar = ({
  loadingUpdate,
  setLoadingUpdate,
  loadingDelete,
  setLoadingDelete
}) => {
  const [avatar, setAvatar] = useState(null);
  const refInputFile = useRef();
  const { setUser, user } = useAuth();

  const handleChange = async (event) => {
    setAvatar(event.target.files[0]);
    if (event.target.files[0].size > 2000000)
      return notifyError("Tamaño del archivo excede el limite de 2MB");

    await handleUpdate(event.target.files[0]);

    return;
  };

  const handleUpdate = async (avatar) => {
    setLoadingUpdate(true);

    try {
      const result = await fetchUpdate(avatar, user.idUser, setUser);
      notifySuccess();
      setUser({
        ...user,
        ["avatar"]: result.avatar,
        ["avatarUrl"]: result.avatarUrl
      });
      refInputFile.current.value = "";
    } catch (error) {
      return notifyError("Ups no se pudo actualizar la imagen de perfil");
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async () => {
    setLoadingDelete(true);

    try {
      const result = await fetchDelete(user.idUser, user.avatar);
      notifySuccess();
      setUser({
        ...user,
        ["avatar"]: null,
        ["avatarUrl"]: null
      });
    } catch (error) {
      return notifyError("Ups no se pudo borrar la imagen de perfil");
    } finally {
      setLoadingDelete(false);
    }
  };

  const notifyError = (error) => toast.error(error);

  const notifySuccess = () => toast.success("¡Imagen de perfil actualizada!");

  return (
    <div className={styles.uploadFile}>
      <div className={styles.row}>
        <label htmlFor="file">
          {!loadingUpdate ? "Actualizar" : "Actualizando..."}
          <img src={iconChangeAvatar}></img>
        </label>

        <button
          className={!user.avatar ? styles.deleteDisabled : ""}
          onClick={() => handleDelete()}
          disabled={loadingDelete || !user.avatar}
        >
          {!loadingDelete ? "Eliminar" : "Eliminando..."}
          <img src={iconDeleteAvatar}></img>
        </button>
      </div>

      <Toaster position="top-center" />
      <input
        ref={refInputFile}
        disabled={loadingUpdate}
        onChange={(event) => handleChange(event)}
        accept="image/png, image/jpeg"
        id="file"
        type="file"
      ></input>
    </div>
  );
};
