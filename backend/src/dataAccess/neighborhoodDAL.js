import sql from "mssql";
import { connection } from "../config/connection";

export class NeighborhoodDAL {
  async add(neighbordhood) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), neighbordhood.propName);
      request.input("idDepartment", sql.Int, neighbordhood.propDepartment);

      const result = await request.execute("AddNeighborhood");

      if (result.returnValue == -1)
        throw new Error("Ya hay un barrio registrado con este nombre", {
          cause: { code: 409 }
        });
      else if (result.returnValue == -2)
        throw new Error("No hay un departamento registrado con este ID", {
          cause: { code: 404 }
        });
      else if (result.returnValue == -3)
        throw new Error("Error inesperado al agregar barrio", {
          cause: { code: 502 }
        });

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async update(neighbordhood) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), neighbordhood.propName);
      request.input("idDepartment", sql.Int, neighbordhood.propDepartment);

      const result = await request.execute("UpdateNeighborhood");

      if (result.returnValue == -1)
        throw new Error("No hay un departamento registrado con este ID", {
          cause: { code: 404 }
        });
      else if (result.returnValue == -2)
        throw new Error("Error inesperado al actualizar barrio", {
          cause: { code: 502 }
        });

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete(neighborhood) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), neighborhood.propName);

      const result = await request.execute("DeleteNeighborhood");

      if (result.returnValue == -1)
        throw new Error("No hay un barrio registrado con este nombre", {
          cause: { code: 404 }
        });
      else if (result.returnValue == -2)
        throw new Error("Error inesperado al eliminar barrio", {
          cause: { code: 502 }
        });

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async getNeighborhoods() {
    try {
      const ps = new sql.PreparedStatement(connection.pool);

      await ps.prepare("select * from neighborhoods");

      const result = await ps.execute();
      await ps.unprepare();

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getNeighborhoodByName(neighbordhood) {
    try {
      const ps = new sql.PreparedStatement(connection.pool);
      ps.input("name", sql.VarChar(30));

      await ps.prepare("select * from neighborhoods where name=@name");

      const result = await ps.execute({ name: neighbordhood.propName });
      await ps.unprepare();

      return result;
    } catch (error) {
      throw error;
    }
  }
}
