import { Neighborhood } from "../entity/neighborhood.js";
import { Population } from "../entity/population.js";
import { PopulationService } from "../service/populationService.js";

export const add = async (req, res) => {
  try {
    if (!req.body) throw new Error("Cuerpo de solicitud no definido");

    const { nameNeighborhood, quantity, year } = req.body;

    const neighborhood = new Neighborhood(0, nameNeighborhood);
    const population = new Population(0, quantity, neighborhood, year);

    await PopulationService.add(population);

    res.status(200).json(true);
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};

export const update = async (req, res) => {
  try {
    if (!req.params.idPopulation == null)
      throw new Error("Poblacion no indicada");

    if (!req.body) throw new Error("Cuerpo de solicitud no definido");

    const { nameNeighborhood, quantity, year } = req.body;
    const idPopulation = parseInt(req.params.idPopulation);

    const neighborhood = new Neighborhood(0, nameNeighborhood);

    const population = new Population(
      idPopulation,
      quantity,
      neighborhood,
      year
    );

    await PopulationService.update(population);

    res.status(200).json(true);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const deleteById = async (req, res) => {
  try {
    if (!req.params.idPopulation == null)
      throw new Error("Poblacion no indicada");

    const idPopulation = req.params.idPopulation;

    await PopulationService.delete(idPopulation);

    res.status(200).json(true);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const getPopulationsYears = async (req, res) => {
  try {
    const populationsYears = await PopulationService.getPopulationsYears();

    if (populationsYears.length == 0)
      throw new Error(
        "No se encontraron registros de años de poblaciones en el sistema"
      );

    res.status(200).json(populationsYears);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const getDatapointsNeighborhoodPopulationsYears = async (req, res) => {
  try {
    if (req.params.nameNeighborhood == null)
      throw new Error("Barrio no definido");

    const nameNeighborhood = decodeURIComponent(req.params.nameNeighborhood);

    const populations =
      await PopulationService.getPopulationsByNameNeighborhood(
        nameNeighborhood
      );

    if (populations.length == 0)
      throw new Error(
        "No se encontraron registros de poblaciones en este barrio en el sistema"
      );

    const datapoints = populations.map((population) => {
      return { x: population.year, y: population.quantity };
    });

    res.status(200).json(datapoints);
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const getPopulationsOffsetByYear = async (req, res) => {
  try {
    if (req.params.offset == null) throw new Error("Offset no definido");

    if (req.params.year == null) throw new Error("Año no definido");

    const offset = parseInt(req.params.offset);
    const year = parseInt(req.params.year);

    const populations = await PopulationService.getPopulationsByYear(year);

    if (populations.length == 0)
      throw new Error(
        "No se encontraron registros de poblaciones en este año en el sistema"
      );

    const populationsOffset =
      await PopulationService.getPopulationsOffsetByYear(offset, year);

    if (populationsOffset.length == 0)
      throw new Error(
        "No se encontraron registros de poblaciones en este año en el sistema"
      );

    res.status(200).json({
      registersOffset: populationsOffset,
      pages: Math.ceil(populations.length / 10)
    });
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};

export const getPopulationsOffsetByNeighborhood = async (req, res) => {
  try {
    if (req.params.offset == null) throw new Error("Offset no definido");

    if (req.params.nameNeighborhood == null)
      throw new Error("Barrio no definido");

    const offset = parseInt(req.params.offset);
    const name = decodeURIComponent(req.params.nameNeighborhood);

    const populations =
      await PopulationService.getPopulationsByNameNeighborhood(name);

    if (populations.length == 0)
      throw new Error(
        "No se encontraron registros de poblaciones en este barrio en el sistema"
      );

    const populationsOffset =
      await PopulationService.getPopulationsOffsetByNameNeighborhood(
        name,
        offset
      );

    if (populationsOffset.length == 0)
      throw new Error(
        "No se encontraron registros de poblaciones en este barrio en el sistema"
      );

    res.status(200).json({
      registersOffset: populationsOffset,
      pages: Math.ceil(populations.length / 10)
    });
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};
