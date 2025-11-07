import sql from "mssql";
import { connection } from "../config/connection";

export class NeighborhoodDAL {
  async add(neighbordhood) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), neighbordhood.propName);
      request.input("idDepartment", sql.Int, neighbordhood.propDepartment);

      const result = await request.execute("AddNeighborhood");

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
