import { NeighborhoodDAL } from "../dataAccessLayer/neighborhoodDAL.js";

export class NeighborhoodService {
  static async add(neighbordhood) {
    try {
      if (neighbordhood == null)
        throw new Error("Debe indicar un barrio para agregar", {
          cause: { code: 400 }
        });
      await NeighborhoodDAL.add(neighbordhood);
    } catch (error) {
      throw error;
    }
  }

  static async update(neighbordhood) {
    try {
      if (neighbordhood == null)
        throw new Error("Debe indicar un barrio para editar", {
          cause: { code: 400 }
        });
      await NeighborhoodDAL.update(neighbordhood);
    } catch (error) {
      throw error;
    }
  }

  static async delete(idNeighborhood) {
    try {
      await NeighborhoodDAL.delete(idNeighborhood);
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

      if (result.length > 0) {
        return result[0];
      } else null;
    } catch (error) {
      throw error;
    }
  }

  static async getNeighborhoodsOffset(offset) {
    try {
      const result = await NeighborhoodDAL.getNeighborhoodsOffset(offset);

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getNeighborhoodsByDepartment(name) {
    try {
      const result = await NeighborhoodDAL.getNeighborhoodsByDepartment(name);

      return result;
    } catch (error) {
      throw error;
    }
  }
  static async getNeighborhoodsByDepartmentOffset(name, offset) {
    try {
      const result = await NeighborhoodDAL.getNeighborhoodsByDepartmentOffset(
        name,
        offset
      );

      return result;
    } catch (error) {
      throw error;
    }
  }
}
