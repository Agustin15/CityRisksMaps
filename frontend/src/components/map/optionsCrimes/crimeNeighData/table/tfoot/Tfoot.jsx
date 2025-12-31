import { useZoneCrimes } from "../../../../../../contexts/zoneCrimesContext/ZoneCrimesContext.jsx";
import { amountCrime, amountRateCrime } from "../functions.js";

export const Tfoot = ({ neighborhoodsCrimeByYear, crime }) => {
  const { defineCrimeRate } = useZoneCrimes();
  return (
    <tfoot>
      <tr>
        <td>
          Total de denuncias {crime}s:
          {neighborhoodsCrimeByYear && amountCrime(neighborhoodsCrimeByYear)}
        </td>
      </tr>
      <tr>
        <td colSpan={4}>
          Tasa total de denuncias de {crime}s 100.000 habitantes:
          {neighborhoodsCrimeByYear &&
            amountRateCrime(neighborhoodsCrimeByYear, defineCrimeRate)}
        </td>
      </tr>
    </tfoot>
  );
};
