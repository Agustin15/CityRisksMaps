import sql from "mssql";
import { connection } from "../config/connection";

export class NeighborhoodDAL {
  async add(name, idDepartment) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), name);
      request.input("idDepartment", sql.Int, idDepartment);

      const result = await request.execute("AddNeighborhood");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }
  async getIdentCurrentTable() {
    try {
      const request = new sql.Request(connection.pool);

      const identCurrent = await request.execute(
        "SELECT IDENT_CURRENT('Neighborhoods')"
      );

      return identCurrent;
    } catch (error) {
      throw error;
    }
  }

  async update(name, idDepartment) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), name);
      request.input("idDepartment", sql.Int, idDepartment);

      const result = await request.execute("UpdateNeighborhood");

      return result.returnValue;
    } catch (error) {
      throw error;
    }
  }

  async delete(name) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), name);

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

  async getNeighborhoodByName(name) {
    try {
      const ps = new sql.PreparedStatement(connection.pool);
      ps.input("name", sql.VarChar(30));

      await ps.prepare("select * from neighborhoods where name=@name");

      const result = await ps.execute({ name: name });
      await ps.unprepare();

      return result;
    } catch (error) {
      throw error;
    }
  }
}
