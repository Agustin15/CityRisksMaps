import styles from "../form/Form.module.css";

export const InputText = ({
  label,
  name,
  placeholder,
  maxLength,
  values,
  setValues,
  errors
}) => {
  return (
    <div className={styles.columnInput}>
      <label>{label}</label>
      <input
        autoComplete="off"
        name={name}
        onChange={(event) =>
          setValues({ ...values, [name]: event.target.value })
        }
        maxLength={maxLength}
        placeholder={placeholder}
        type="text"
        value={values[name]}
      ></input>
      {errors && <p>{errors[name]}</p>}
    </div>
  );
};
