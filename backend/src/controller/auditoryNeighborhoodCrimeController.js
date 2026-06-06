import { AuditoryNeighborhoodCrimeService } from "../service/auditoryNeighborhoodCrimeService.js";

export const getDatesOfAuditoryNeighborhoodsCrimes = async (req, res) => {
  try {
    let results =
      await AuditoryNeighborhoodCrimeService.getDatesOfAuditoryNeighborhoodsCrimes();

    if (results.length == 0)
      throw new Error(
        "No se encontraron registros de auditorias en el sistema"
      );

    results = results.map((result) => result.auditoryDate);

    return res.status(200).json(results);
  } catch (error) {
    return res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};

export const getAuditoryNeighborhoodsCrimesOffsetByDate = async (req, res) => {
  try {
    if (!req.params.datetime)
      throw new Error("Fecha no indicada en los parámetros", {
        cause: { code: 400 }
      });

    if (!req.params.offset)
      throw new Error("Offset no indicado en los parámetros", {
        cause: { code: 400 }
      });

    const datetime = req.params.datetime;
    const offset = parseInt(req.params.offset);

    const results =
      await AuditoryNeighborhoodCrimeService.getAuditoryNeighborhoodsCrimesByDate(
        datetime
      );

    if (results.length == 0)
      throw new Error(
        "No se encontraron registros de auditorias en el sistema"
      );

    const resultsOffset =
      await AuditoryNeighborhoodCrimeService.getAuditoryNeighborhoodsCrimesOffsetByDate(
        datetime,
        offset
      );

    if (results.length == 0)
      throw new Error(
        "No se encontraron registros de auditorias en el sistema"
      );

    return res
      .status(200)
      .json({
        registersOffset: resultsOffset,
        pages: Math.ceil(results.length / 10)
      });
  } catch (error) {
    return res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};
