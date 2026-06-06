const BACKEND_URL = import.meta.env.VITE_LOCALHOST_BACKEND;

export const fetchSendEmail = async (consultationData) => {
  try {
    const response = await fetch(`${BACKEND_URL}/sendConsultation/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(consultationData)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.messageError);
    }
  } catch (error) {
    throw error;
  }
};

export const validationForm = (event, values) => {
  event.preventDefault();
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const errorsValues = { name: "", email: "", message: "" };

  Object.keys(values).forEach((key) => {
    if (values[key].length == 0) {
      errorsValues[key] =
        "*Debe ingresar su " + (key == "name" ? "nombre" : "apellido");
    }
    if (key == "email" && !regexEmail.test(values[key]))
      errorsValues[key] = "*Ingrese un correo valido";
  });

  return errorsValues;
};
