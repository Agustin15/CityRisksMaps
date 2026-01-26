export const handleChange = (event, valuesForm, setValuesForm) => {
  let { name, value } = event;

  if (name == "reasons") {
    if (valuesForm.reasons.find((reason) => reason == value)) {
      setValuesForm({
        ...valuesForm,
        [name]: valuesForm.reasons.filter((reason) => reason != value)
      });
    } else {
      setValuesForm({
        ...valuesForm,
        [name]: [...valuesForm.reasons, value]
      });
    }
  } else {
    if (name == "perception") value = value == "secure" ? 1 : 0;

    setValuesForm({ ...valuesForm, [name]: value });
  }
};
