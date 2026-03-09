import { Activity } from "react";
import { calculateAmountCrime, calculateAmountRate } from "../functions.js";

export const Tfoot = ({
  neighborhoodsCrimeByYear,
  crime,
  elementSearchedNotFound
}) => {
  return (
    <Activity mode={elementSearchedNotFound ? "hidden" : "visible"}>
      <tfoot>
        <tr>
          <td colSpan={4}>
            Total de denuncias {crime}s:
            {neighborhoodsCrimeByYear &&
              calculateAmountCrime(neighborhoodsCrimeByYear).toLocaleString()}
          </td>
        </tr>
        <tr>
          <td colSpan={5}>
            Tasa total de denuncias de {crime}s 100.000 habitantes:
            {neighborhoodsCrimeByYear &&
              calculateAmountRate(neighborhoodsCrimeByYear).toFixed(1) + " "}
          </td>
        </tr>
      </tfoot>
    </Activity>
  );
};
