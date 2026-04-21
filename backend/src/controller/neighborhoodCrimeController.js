import fs from "fs";
import iconv from "iconv-lite";
import csv from "csvtojson";
import { NeighborhoodCrimeService } from "../service/neighborhoodCrimeService.js";
import { NeighborhoodService } from "../service/neighborhoodService.js";

export const addThroughtTable = async (req, res) => {
  try {
    if (!req.body) throw new Error("Cuerpo de solicitud no definido");
    if (!req.params) throw new Error("Parametros de solicitud no definidos");

    let { year, crime, neighborhoodsCrime, department, optionAdd } = req.body;

    if (!crime || crime.length == 0)
      throw new Error("Debe indicar una categoria de delito");

    if (!year) throw new Error("Debe indicar un año");
    if (year > new Date().getFullYear())
      throw new Error("Año debe ser menor al año actual");

    if (optionAdd == "addThroughtFile") {
      if (!department || department.length == 0)
        throw new Error("Debe indicar departamento del delito");

      if (!req.file)
        throw new Error("Debe indicar un archivo para subir  la información");

      if (req.file.mimetype != "text/csv")
        throw new Error("Debe indicar un archivo formato CSV");

      const json = await readerFile(req.file);

      const neighborhoods = await NeighborhoodService.getNeighborhoods();

      if (neighborhoods.length == 0)
        throw new Error("No hay barrios registrados en el sistema");

      neighborhoodsCrime = filterFile(
        department,
        crime,
        neighborhoods,
        year,
        json
      );
    } else if (neighborhoodsCrime.length == 0) {
      throw new Error(
        "Debe indicar al menos un barrio con su cantidad de delitos"
      );
    }
    await NeighborhoodCrimeService.addThroughtTable(
      neighborhoodsCrime,
      crime,
      year
    );

    return res.status(200).json(true);
  } catch (error) {
    return res
      .status(error.cause ? error.cause.code : 502)
      .json({ messageError: error.message });
  }
};

const readerFile = async (file) => {
  const buffer = fs.readFileSync(file.path);
  const utf8String = iconv.decode(buffer, "latin1");

  const result = await csv({
    noheader: false,
    output: "json",
    delimiter: ";"
  }).fromString(utf8String);

  return result;
};

const normalize = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
};

const filterFile = (department, crime, neighborhoods, year, json) => {
  let filteredByCrimeYearDepartment = json.filter((item) => {
    return (
      normalize(item.DEPTO.trim()) == normalize(department) &&
      normalize(item.DELITO.trim()) == normalize(crime) &&
      normalize(item.TENTATIVA.trim()) == "NO" &&
      item.AÑO == year
    );
  });

  let neighborhoodsCrime = [];

  filteredByCrimeYearDepartment.forEach((item) => {
    if (item.BARRIO_MONTEVIDEO.trim() == "SIN CLASIFICAR") return;
    const found =
      neighborhoodsCrime.length == 0
        ? null
        : neighborhoodsCrime.find((f) => {
            if (
              normalize(f.nameNeighborhood.trim()) ==
              normalize(item.BARRIO_MONTEVIDEO.trim())
            )
              return f;
          });

    if (!found) {
      const neighborhoodFound = neighborhoods.find((neighborhood) => {
        if (
          normalize(item.BARRIO_MONTEVIDEO.trim()) ==
          normalize(neighborhood.name.trim())
        )
          return neighborhood;
      });

      neighborhoodsCrime.push({
        nameNeighborhood: neighborhoodFound.name,
        crime: crime,
        amount: 1,
        year: year
      });
    } else {
      found.amount++;
    }
  });

  return neighborhoodsCrime;
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
