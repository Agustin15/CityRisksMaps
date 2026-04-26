import fs from "fs";
import iconv from "iconv-lite";
import csv from "csvtojson";
import { NeighborhoodCrimeService } from "../service/neighborhoodCrimeService.js";
import { NeighborhoodService } from "../service/neighborhoodService.js";

export const addThroughtTable = async (req, res) => {
  try {
    if (!req.body) throw new Error("Cuerpo de solicitud no definido");
    const { year, crime, neighborhoodsCrime } = req.body;

    if (!crime || crime.length == 0)
      throw new Error("Debe indicar una categoria de delito");

    if (!year) throw new Error("Debe indicar un año");
    if (year > new Date().getFullYear())
      throw new Error("Año debe ser menor al año actual");

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

export const loadNeighborhoodsCrimeFromFile = async (req, res) => {
  try {
    if (!req.body) throw new Error("Cuerpo de solicitud no definido");

    const { year, crime, department, neighborhoodsSelected } = req.body;

    if (!crime || crime.length == 0)
      throw new Error("Debe indicar una categoria de delito");

    if (!year) throw new Error("Debe indicar un año");
    if (year > new Date().getFullYear())
      throw new Error("Año debe ser menor al año actual");

    if (!department || department.length == 0)
      throw new Error("Debe indicar departamento del delito");

    if (!req.file)
      throw new Error("Debe indicar un archivo para subir  la información");

    if (req.file.mimetype != "text/csv")
      throw new Error("Debe indicar un archivo formato CSV");

    if (req.file.size > 115000000)
      throw new Error("Tamaño del archivo excede el limite de 110MB");

    const json = await readerFile(req.file);

    const neighborhoodsCrime = filterFile(
      department,
      crime,
      year,
      neighborhoodsSelected,
      json
    );

    res.status(200).json(neighborhoodsCrime);
  } catch (error) {
    res
      .status(error.cause ? error.cause.code : 404)
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

const filterFile = (department, crime, year, neighborhoodsSelected, json) => {
  let filteredByCrimeYearDepartment = json.filter((item) => {
    if (
      normalize(item.DEPTO.trim()) == normalize(department) &&
      normalize(item.DELITO.trim()) == normalize(crime) &&
      normalize(item.TENTATIVA.trim()) == "NO" &&
      item.AÑO == year &&
      neighborhoodsSelected.some(
        (neighborhood) =>
          normalize(neighborhood) == normalize(item.BARRIO_MONTEVIDEO.trim())
      )
    )
      return item;
  });

  if (filteredByCrimeYearDepartment.length == 0)
    throw new Error(
      "No se encontraron registros de este tipo de delito en los barrios seleccionados" +
        " en el archivo subido"
    );

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
      const neighborhoodFound = neighborhoodsSelected.find((neighborhood) => {
        if (normalize(item.BARRIO_MONTEVIDEO.trim()) == normalize(neighborhood))
          return neighborhood;
      });

      neighborhoodsCrime.push({
        nameNeighborhood: neighborhoodFound,
        crime: crime,
        amount: 1,
        dateOfLastCrime: formatDate(item.FECHA),
        year: year
      });
    } else {
      found.amount++;
      if (new Date(formatDate(item.FECHA)) > new Date(found.dateOfLastCrime)) {
        found.dateOfLastCrime = formatDate(item.FECHA);
      }
    }
  });

  return neighborhoodsCrime;
};

const formatDate = (dateString) => {
  const partsDate = dateString.split(".");

  return partsDate[2] + "-" + partsDate[1] + "-" + partsDate[0];
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
