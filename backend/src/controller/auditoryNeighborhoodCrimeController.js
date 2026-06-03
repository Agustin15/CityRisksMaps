import { AuditoryNeighborhoodCrimeService } from "../service/auditoryNeighborhoodCrimeService.js";

export const getDatesOfAuditoryNeighborhoodsCrimes = async (req, res) => {
  try {
    const result =
      await AuditoryNeighborhoodCrimeService.getDatesOfAuditoryNeighborhoodsCrimes();

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(error.cause ? error.cause.code : 502)
      .json({ messageError: error.message });
  }
};

export const getAuditoryNeighborhoodsCrimesByDate = async (req, res) => {
  try {
    if (!req.params.datetime)
      throw new Error("Fecha no indicada en los parámetros", {
        cause: { code: 400 }
      });

    const datetime = req.params.datetime;

    const result =
      await AuditoryNeighborhoodCrimeService.getAuditoryNeighborhoodsCrimesByDate(
        datetime
      );

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(error.cause ? error.cause.code : 502)
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

    const result =
      await AuditoryNeighborhoodCrimeService.getAuditoryNeighborhoodsCrimesOffsetByDate(
        datetime,
        offset
      );

    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(error.cause ? error.cause.code : 502)
      .json({ messageError: error.message });
  }
};
