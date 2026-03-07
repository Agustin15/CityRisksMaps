import { useState } from "react";

export const InputSearcher = ({ tableRef }) => {
  const [valueInput, setValueInput] = useState("");

  const handleChange = (event) => {
    setValueInput(event.target.value);

    const tbody = tableRef.current.querySelector("tbody");
    const rows = [...tbody.querySelectorAll("tr")];

    rows.map((row) => {
      if (row.classList.length > 0) {
        if (
          row.textContent
            .toLowerCase()
            .indexOf(event.target.value.toLowerCase()) > -1
        )
          row.style.display = "table-row";
        else row.style.display = "none";
      }
    });
  };
  return (
    <input
      onChange={(event) => handleChange(event)}
      value={valueInput}
      placeholder="Buscar..."
      type="text"
    ></input>
  );
};
