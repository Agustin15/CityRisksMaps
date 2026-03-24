import sql from "mssql";
import { connection } from "../config/connection.js";

export class NeighborhoodDAL {
  static async add(neighbordhood) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), neighbordhood.name);
      request.input(
        "idDepartment",
        sql.Int,
        neighbordhood.department.idDepartment
      );

      const result = await request.execute("AddNeighborhood");

      switch (result.returnValue) {
        case -1:
          throw new Error("Nombre no debe tener mas de 30 caracteres", {
            cause: { code: 400 }
          });
        case -2:
          throw new Error("Ya hay un barrio registrado con este nombre", {
            cause: { code: 409 }
          });
        case -3:
          throw new Error("No hay un departamento registrado con este ID", {
            cause: { code: 404 }
          });
        case -4:
          throw new Error("Error inesperado al agregar barrio", {
            cause: { code: 502 }
          });
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  static async update(neighbordhood) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idNeighborhood", sql.Int, neighbordhood.idNeighborhood);
      request.input("name", sql.VarChar(30), neighbordhood.name);
      request.input(
        "idDepartment",
        sql.Int,
        neighbordhood.department.idDepartment
      );

      const result = await request.execute("UpdateNeighborhood");

      switch (result.returnValue) {
        case -1:
          throw new Error("Nombre no debe tener mas de 30 caracteres", {
            cause: { code: 400 }
          });

        case -2:
          throw new Error("No hay un departamento registrado con este ID", {
            cause: { code: 404 }
          });
        case -3:
          throw new Error("Error inesperado al agregar barrio", {
            cause: { code: 502 }
          });
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  static async delete(idNeighborhood) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idNeighborhood", sql.Int, idNeighborhood);

      const result = await request.execute("DeleteNeighborhood");

      if (result.returnValue == -1)
        throw new Error("No hay un barrio registrado con este nombre", {
          cause: { code: 404 }
        });
      else if (result.returnValue == -2)
        throw new Error("Error inesperado al eliminar barrio", {
          cause: { code: 502 }
        });
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getNeighborhoods() {
    try {
      const request = new sql.Request(connection.pool);

      const result = await request.execute("AllNeighborhoods");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getNeighborhoodsByIdDepartment(idDepartment) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idDepartment", sql.Int, idDepartment);

      const result = await request.execute("AllNeighborhoodsByIdDepartment");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getNeighborhoodsOffset(offset) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("offset", sql.Int, offset);

      const result = await request.execute("NeighborhoodsOffset");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getNeighborhoodsByIdDepartmentOffset(idDepartment, offset) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("idDepartment", sql.Int, idDepartment);
      request.input("offset", sql.Int, offset);

      const result = await request.execute("NeighborhoodsByIdDepartmentOffset");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getNeighborhoodByName(name) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), name);

      const result = await request.execute("NeighborhoodByName");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }
}
