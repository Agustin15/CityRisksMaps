import { NeighborhoodDAL } from "../dataAccess/neighborhoodDal";

export class NeighborhoodService {
  static async add(neighbordhood) {
    try {
      if (neighbordhood == null)
        throw new Error("Debe indicar un barrio para agregar");
      const added = await NeighborhoodDAL.add(neighbordhood);

      return added;
    } catch (error) {
      throw error;
    }
  }

  static async update(neighbordhood) {
    try {
      if (neighbordhood == null)
        throw new Error("Debe indicar un barrio para editar");
      const updated = await NeighborhoodDAL.update(neighbordhood);

      return updated;
    } catch (error) {
      throw error;
    }
  }

  static async delete(name) {
    try {
      const deleted = await NeighborhoodDAL.delete(name);
      return deleted;
    } catch (error) {
      throw error;
    }
  }

  static async getNeighborhoods() {
    try {
      const result = await NeighborhoodDAL.getNeighborhoods();

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getNeighborhoodByName(name) {
    try {
      const result = await NeighborhoodDAL.getNeighborhoodByName(name);

      if (result.recordset.length > 0) {
        return result[0];
      } else null;
    } catch (error) {
      throw error;
    }
  }
}
