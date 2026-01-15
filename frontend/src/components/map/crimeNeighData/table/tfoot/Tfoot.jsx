import { useZoneCrimes } from "../../../../../contexts/zoneCrimesContext/ZoneCrimesContext.jsx";
import {
  calculateAmountCrime,
  calculateAmountRateCrime
} from "../functions.js";

export const Tfoot = ({ neighborhoodsCrimeByYear, crime }) => {
  const { defineCrimeRate } = useZoneCrimes();
  return (
    <tfoot>
      <tr>
        <td>
          Total de denuncias {crime}s:
          {neighborhoodsCrimeByYear &&
            calculateAmountCrime(neighborhoodsCrimeByYear).toLocaleString()}
        </td>
      </tr>
      <tr>
        <td colSpan={4}>
          Tasa total de denuncias de {crime}s 100.000 habitantes:
          {neighborhoodsCrimeByYear &&
            calculateAmountRateCrime(neighborhoodsCrimeByYear).toLocaleString()}
        </td>
      </tr>
    </tfoot>
  );
};
