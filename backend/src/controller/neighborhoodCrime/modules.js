import fs from "fs";
import iconv from "iconv-lite";
import csv from "csv-parser";
import { stringSimilarity } from "string-similarity-js";
import { Readable } from "stream";
import { NeighborhoodService } from "../../service/neighborhoodService.js";
import { NeighborhoodCrimeService } from "../../service/neighborhoodCrimeService.js";

export const loadNeighborhoodsCrimeFromFile = async (crime, year) => {
  try {
    if (!process.env.URL_DATASET_OTHER_CRIMES)
      throw new Error("URL_DATASET_OTHER_CRIMES no declarada");

    const URL_DATASET_OTHER_CRIMES = process.env.URL_DATASET_OTHER_CRIMES;

    const response = await fetch(URL_DATASET_OTHER_CRIMES);

    if (!response.ok) throw new Error("Archivo no encontrado");

    const neighborhoods = await NeighborhoodService.getNeighborhoods();

    if (neighborhoods.length == 0)
      throw new Error("No se encontraron registros de barrios en el sistema");

    let neighborhoodsCrime = await readerFile(
      Readable.fromWeb(response.body),
      "Montevideo",
      crime,
      year,
      neighborhoods
    );

    neighborhoodsCrime = neighborhoods.map((neighborhood) => {
      const found = neighborhoodsCrime.find(
        (nhCrime) => nhCrime.name == neighborhood.name
      );

      if (found) return found;
      else
        return {
          idNeighborhood: neighborhood.idNeighborhood,
          name: neighborhood.name,
          amount: 0
        };
    });

    return neighborhoodsCrime;
  } catch (error) {
    throw error;
  }
};

const normalize = (text) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
};

const readerFile = async (readable, department, crime, year, neighborhoods) => {
  const neighborhoodMap = new Map();

  const normalizedDept = normalize(department);
  const normalizedCrime = normalize(crime);

  return new Promise((resolve, reject) => {
    try {
      readable
        .pipe(iconv.decodeStream("utf8"))
        .pipe(csv({ escape: "\n", separator: ";" }))
        .on("data", (jsonObject) => {
          if (Object.keys(jsonObject).length === 0) return;
          if (
            normalize(jsonObject.DEPTO.trim()) === normalizedDept &&
            normalize(jsonObject.DELITO.trim()) === normalizedCrime &&
            normalize(jsonObject.TENTATIVA.trim()) === "NO" &&
            jsonObject.AÑO == year
          ) {
            const barrio = jsonObject.BARRIO_MONTEVIDEO.trim();
            if (barrio === "SIN CLASIFICAR") return;
            const normalizedBarrio = normalize(barrio);

            let neighborhoodFound = neighborhoods.find(
              (neighborhood) =>
                stringSimilarity(
                  normalize(neighborhood.name),
                  normalizedBarrio
                ) >= 0.8
            );

            if (!neighborhoodFound)
              return reject(
                "Barrio del archivo CSV de AECA no encontrado en el sistema"
              );

            const neighborhoodData = neighborhoodMap.get(
              neighborhoodFound.name
            );

            if (neighborhoodData) {
              neighborhoodData.amount++;
            } else {
              neighborhoodMap.set(neighborhoodFound.name, {
                idNeighborhood: neighborhoodFound.idNeighborhood,
                name: neighborhoodFound.name,
                amount: 1
              });
            }
          }
        })
        .on("end", () => {
          if (neighborhoodMap.size === 0) {
            reject(
              new Error(
                "No se encontraron registros en el archivo fuente CSV de AECA " +
                  "de este tipo de delito en los barrios seleccionados"
              )
            );
          } else {
            resolve(Array.from(neighborhoodMap.values()));
          }
        })
        .on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};

export const searchNeighborhoodsCrimeToAddOrUpdate = async (crimes) => {
  const neighborhoodsCrimes = [];

  try {
    for (const crime of crimes) {
      let neighborhoodsCrimeFromFile = await loadNeighborhoodsCrimeFromFile(
        crime.category,
        new Date().getFullYear()
      );

      const neighborhoodsCrimeFromDatabase =
        await NeighborhoodCrimeService.getNeighborhoodsCrimeByYear(
          crime.category,
          new Date().getFullYear()
        );

      if (neighborhoodsCrimeFromDatabase.length > 0) {
        neighborhoodsCrimeFromFile = neighborhoodsCrimeFromFile.filter(
          (neighborhoodCrime) => {
            const found = neighborhoodsCrimeFromDatabase.find(
              (neighborhoodCrimeDatabase) =>
                neighborhoodCrimeDatabase.neighborhood ==
                  neighborhoodCrime.name &&
                neighborhoodCrimeDatabase.quantity != neighborhoodCrime.amount
            );
            if (found) return neighborhoodCrime;
          }
        );
        if (neighborhoodsCrimeFromFile.length == 0) continue;
      }

      neighborhoodsCrimes.push({
        neighborhoodsCrime: neighborhoodsCrimeFromFile,
        crime: crime.category,
        year: new Date().getFullYear()
      });
    }
    return neighborhoodsCrimes;
  } catch (error) {
    throw error;
  }
};
