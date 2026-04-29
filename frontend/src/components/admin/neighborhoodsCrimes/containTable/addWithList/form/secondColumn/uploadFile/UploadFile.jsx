import styles from "./UploadFile.module.css";
import iconUpload from "../../../../../../../../assets/img/upload.png";
import { useAddNeighborhoodCrime } from "../../../../../../../../contexts/adminContext/addNeighborhoodsCrimeContext/AddNeighborhoodCrimeContext";

export const UploadFile = () => {
  const { values, setValues, errors } = useAddNeighborhoodCrime();

  return (
    <div className={styles.uploadFile}>
      <label htmlFor="file">Datos a partir de archivo CSV:</label>

      <label className={styles.btnUpload} htmlFor="file">
        {values.file ? "Archivo " + values.file.name : "Subir (Max:110MB)"}
        <img src={iconUpload}></img>
      </label>
      <input
        accept=".csv, text/csv"
        id="file"
        autoComplete="off"
        name="file"
        onChange={(event) =>
          setValues({ ...values, ["file"]: event.target.files[0] })
        }
        type="file"
      ></input>

      {errors && <p>{errors.file}</p>}
    </div>
  );
};
