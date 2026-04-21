import styles from "./CompleteName.module.css";

export const CompleteName = ({ errors, setErrors, values, setValues }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });

    switch (name) {
      case "name":
        if (value.length == 0)
          setErrors({ ...errors, ["name"]: "Nombre no puede estar vacio" });
        else setErrors({ ...errors, ["name"]: "" });
        break;
      case "lastname":
        if (value.length == 0)
          setErrors({
            ...errors,
            ["lastname"]: "Apellido no puede estar vacio"
          });
        else setErrors({ ...errors, ["lastname"]: "" });
        break;
    }
  };

  return (
    <>
      <div className={styles.columnInput}>
        <label>Nombre:</label>
        <input
          autoComplete="off"
          name="name"
          onChange={(event) => handleChange(event)}
          value={values.name}
          placeholder="Nombre"
          type="text"
        ></input>
        {errors.name.length > 0 && <p>*{errors.name}</p>}
      </div>
      <div className={styles.columnInput}>
        <label>Apellido:</label>
        <input
          autoComplete="off"
          name="lastname"
          onChange={(event) => handleChange(event)}
          value={values.lastname}
          placeholder="Apellido"
          type="text"
        ></input>
        {errors.lastname.length > 0 && <p>*{errors.lastname}</p>}
      </div>
    </>
  );
};
