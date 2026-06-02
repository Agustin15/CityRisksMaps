import { NeighborhoodCrimeService } from "../../service/neighborhoodCrimeService.js";
import { NeighborhoodService } from "../../service/neighborhoodService.js";
import { CrimeService } from "../../service/crimeService.js";
import {
  loadNeighborhoodsCrimeFromFile,
  searchNeighborhoodsCrimeToAddOrUpdate
} from "./modules.js";

export const addThroughtTable = async (req, res) => {
  try {
    if (!req.body) throw new Error("Cuerpo de solicitud no definido");
    let { year, crime, neighborhoodsCrime } = req.body;

    if (!crime || crime.length == 0)
      throw new Error("Debe indicar una categoria de delito");

    if (!year) throw new Error("Debe indicar un año");
    if (year > new Date().getFullYear())
      throw new Error("Año debe ser menor al año actual");

    if (neighborhoodsCrime.length == 0)
      neighborhoodsCrime = await loadNeighborhoodsCrimeFromFile(crime, year);

    await NeighborhoodCrimeService.addThroughtTable(
      neighborhoodsCrime,
      crime,
      year
    );

    res.status(200).json(true);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 502)
      .json({ messageError: error.message });
  }
};

export const deleteById = async (req, res) => {
  try {
    if (!JSON.parse(req.params.idCompound))
      throw new Error("Identificadores de crimen en barrio no indicados");

    let { year, crime, idNeighborhood } = JSON.parse(req.params.idCompound);

    if (!crime || crime.length == 0)
      throw new Error(
        "Debe indicar una categoria de delito para la eliminacion"
      );

    if (!idNeighborhood)
      throw new Error("Debe indicar un barrio para la eliminacion");

    if (!year) throw new Error("Debe indicar un año para la eliminacion");

    if (year > new Date().getFullYear())
      throw new Error("Año debe ser menor o igual al año actual");

    await NeighborhoodCrimeService.delete(crime, idNeighborhood, year);

    res.status(200).json(true);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 502)
      .json({ messageError: error.message });
  }
};

export const updateThroughtTable = async (req, res) => {
  try {
    if (!req.body) throw new Error("Cuerpo de solicitud no definido");
    let { year, crime, neighborhoodsCrime } = req.body;

    if (!crime || crime.length == 0)
      throw new Error("Debe indicar una categoria de delito");

    if (!year) throw new Error("Debe indicar un año");
    if (year > new Date().getFullYear())
      throw new Error("Año debe ser menor o igual al año actual");

    if (neighborhoodsCrime.length == 0)
      neighborhoodsCrime = await loadNeighborhoodsCrimeFromFile(crime, year);

    await NeighborhoodCrimeService.updateThroughtTable(
      neighborhoodsCrime,
      crime,
      year
    );

    res.status(200).json(true);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const reviewNewsCrimesToUpdate = async () => {
  try {
    const years = await NeighborhoodCrimeService.getAllYearsOfCrimes();

    if (years.length == 0)
      throw new Error("No se encontraron años de delitos en el sistema");

    let crimes = await CrimeService.getAllTypeCrimes();

    if (crimes.length == 0)
      throw new Error("No se encontraron categorias de delitos en el sistema");

    crimes = crimes.filter((crime) => crime.category != "Homicidio");

    const currentYearFound = years.find(
      (objectYear) => objectYear.year == new Date().getFullYear()
    );

    const neighborhoodsCrimes =
      await searchNeighborhoodsCrimeToAddOrUpdate(crimes);

    if (neighborhoodsCrimes.length == 0) return;

    if (currentYearFound) {
      for (const dataNeighborhoodsCrime of neighborhoodsCrimes) {
        await NeighborhoodCrimeService.updateThroughtTable(
          dataNeighborhoodsCrime.neighborhoodsCrime,
          dataNeighborhoodsCrime.crime,
          dataNeighborhoodsCrime.year
        );
      }
    } else {
      for (const dataNeighborhoodsCrime of neighborhoodsCrimes) {
        await NeighborhoodCrimeService.addThroughtTable(
          dataNeighborhoodsCrime.neighborhoodsCrime,
          dataNeighborhoodsCrime.crime,
          dataNeighborhoodsCrime.year
        );
      }
    }
  } catch (error) {
    throw error;
  }
};

export const getNeighborhoodsCrimeByYear = async (req, res) => {
  try {
    const year = req.params.year;
    const categoryCrime = req.params.categoryCrime;

    if (!year) throw new Error("Debe ingresar un año para la busqueda");
    if (!categoryCrime)
      throw new Error("Debe ingresar un categoria de crimen para la busqueda");

    const neighborhoodsCrimes =
      await NeighborhoodCrimeService.getNeighborhoodsCrimeByYear(
        categoryCrime,
        year
      );

    if (neighborhoodsCrimes.length == 0)
      throw new Error("No hay registros de crimenes en barrios en este año");

    res.status(200).json(neighborhoodsCrimes);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const getNeighborhoodsCrimeByYearOffset = async (req, res) => {
  try {
    const year = req.params.year;
    const categoryCrime = req.params.categoryCrime;
    const offset = req.params.offset;

    if (!year) throw new Error("Debe ingresar un año para la busqueda");
    if (!categoryCrime)
      throw new Error("Debe ingresar un categoria de crimen para la busqueda");
    if (offset == null)
      throw new Error("Debe ingresar un offset para la busqueda");

    const neighborhoodsCrimes =
      await NeighborhoodCrimeService.getNeighborhoodsCrimeByYearSecondVersion(
        categoryCrime,
        year
      );

    if (neighborhoodsCrimes.length == 0)
      throw new Error("No hay registros de crimenes en barrios en este año");

    const neighborhoodsCrimesOffset =
      await NeighborhoodCrimeService.getNeighborhoodsCrimeByYearOffset(
        categoryCrime,
        year,
        offset
      );

    if (neighborhoodsCrimesOffset.length == 0)
      throw new Error("No hay registros de crimenes en barrios en este año");

    res.status(200).json({
      registersOffset: neighborhoodsCrimesOffset,
      pages: Math.ceil(neighborhoodsCrimes.length / 10)
    });
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const getYearsNeighborhoodsCrime = async (req, res) => {
  try {
    const categoryCrime = req.params.categoryCrime;

    if (!categoryCrime)
      throw new Error("Debe ingresar un categoria de crimen para la busqueda");

    const yearsNeighborhoodsCrimes =
      await NeighborhoodCrimeService.getYearsNeighborhoodsCrime(categoryCrime);

    if (yearsNeighborhoodsCrimes && yearsNeighborhoodsCrimes.length == 0)
      throw new Error("No hay registros de este tipo de crimen en barrios");

    res.status(200).json(yearsNeighborhoodsCrimes);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const getCategoryCrimeInNeighborhood = async (req, res) => {
  try {
    const categoryCrime = req.params.categoryCrime;
    const idNeighborhood = req.params.idNeighborhood;

    if (!categoryCrime)
      throw new Error("Debe ingresar un categoria de crimen para la busqueda");

    if (!idNeighborhood)
      throw new Error("Debe ingresar un barrio para la busqueda");

    const categoryCrimeInNeighborhood =
      await NeighborhoodCrimeService.getCategoryCrimeInNeighborhood(
        categoryCrime,
        idNeighborhood
      );

    if (!categoryCrimeInNeighborhood || categoryCrimeInNeighborhood.length == 0)
      throw new Error(
        "No se encontraron registros de este crimen en este barrio"
      );

    return res.status(200).json(categoryCrimeInNeighborhood);
  } catch (error) {
    return res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const getAmountAnCrimeInNeighborhoodByYear = async (req, res) => {
  try {
    const year = req.params.year;
    const categoryCrime = req.params.categoryCrime;
    const neighborhoodsCrimeToGet = JSON.parse(
      req.params.neighborhoodsCrimeToGet
    );

    if (!year) throw new Error("Debe ingresar un año para la busqueda");
    if (!categoryCrime)
      throw new Error("Debe ingresar un categoria de crimen para la busqueda");

    if (!neighborhoodsCrimeToGet || neighborhoodsCrimeToGet.length == 0)
      throw new Error(
        "Debe ingresar al menos un barrio en el que desee obtener la cantidad de delitos"
      );

    const amountCategoryCrimeInNeighborhoods = [];

    for (const hoodCrime of neighborhoodsCrimeToGet) {
      const amountCrimesInNeighborhoodByYear =
        await NeighborhoodCrimeService.getAmountAnCrimeInNeighborhoodByYear(
          categoryCrime,
          year,
          hoodCrime.idNeighborhood
        );

      if (amountCrimesInNeighborhoodByYear.length == 0) {
        throw new Error(
          "No se encontraron registros de delitos en esta categoria de " +
            "crimen,barrio y año solicitado"
        );
      }
      const amount = amountCrimesInNeighborhoodByYear[0].quantity;

      amountCategoryCrimeInNeighborhoods.push({
        idNeighborhood: hoodCrime.idNeighborhood,
        name: hoodCrime.name,
        amount: amount
      });
    }

    if (amountCategoryCrimeInNeighborhoods.length == 0)
      throw new Error(
        "No hay registros de crimenes en los barrios seleccionados en este año"
      );

    return res.status(200).json(amountCategoryCrimeInNeighborhoods);
  } catch (error) {
    return res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const getIncreaseOfCrimeInYears = async (req, res) => {
  try {
    const categoryCrime = req.params.categoryCrime;

    if (!categoryCrime)
      throw new Error("Debe ingresar un categoria de crimen para la busqueda");

    const result =
      await NeighborhoodCrimeService.getIncreaseOfCrimeInYears(categoryCrime);

    if (!result || result.length == 0)
      throw new Error(
        "No se encontraron registros de este crimen en el sistema"
      );

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const getIncreaseOfCrimeInNeighborhood = async (req, res) => {
  try {
    const categoryCrime = req.params.categoryCrime;
    const idNeighborhood = req.params.idNeighborhood;

    if (!categoryCrime)
      throw new Error("Debe ingresar un categoria de crimen para la busqueda");

    if (!idNeighborhood)
      throw new Error("Debe ingresar un barrio para la busqueda");

    const result =
      await NeighborhoodCrimeService.getIncreaseOfCrimeInNeighborhood(
        categoryCrime,
        idNeighborhood
      );

    if (!result || result.length == 0)
      throw new Error(
        "No se encontraron registros de este crimen en este barrio en el sistema"
      );

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const getAllYearsOfCrimes = async (req, res) => {
  try {
    const result = await NeighborhoodCrimeService.getAllYearsOfCrimes();

    if (!result || result.length == 0)
      throw new Error(
        "No se encontraron registros de años de crimenes en barrios"
      );

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const getAmountOfDifferentsCrimesInNeighborhoodInYear = async (
  req,
  res
) => {
  try {
    const year = req.params.year;
    const idNeighborhood = req.params.idNeighborhood;

    if (!year) throw new Error("Debe ingresar un año para la busqueda");

    if (!idNeighborhood)
      throw new Error("Debe ingresar un barrio para la busqueda");

    const result =
      await NeighborhoodCrimeService.getAmountOfDifferentsCrimesInNeighborhoodInYear(
        idNeighborhood,
        year
      );

    if (!result || result.length == 0)
      throw new Error(
        "No se encontraron registros de crimenes en este barrio y este año en el sistema"
      );

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const getAmountOfAnCrimeInNeighborhoodsByYear = async (req, res) => {
  try {
    const year = req.params.year;
    const crime = req.params.crime;
    const offset = req.params.offset;

    if (!year) throw new Error("Debe ingresar un año para la busqueda");

    if (!crime) throw new Error("Debe ingresar un crimen para la busqueda");

    if (offset == null)
      throw new Error(
        "Debe indicar desde que numero de barrio quiere obtener los datos"
      );

    const result =
      await NeighborhoodCrimeService.getAmountOfAnCrimeInNeighborhoodsByYear(
        crime,
        year,
        offset
      );

    if (!result || result.length == 0)
      throw new Error(
        "No se encontraron registros de este crimen en este año en el sistema"
      );

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};
