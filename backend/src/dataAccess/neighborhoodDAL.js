import sql from "mssql";
import { Neighborhood } from "../model/neighborhood.js";
import { connection } from "../config/connection";

export class NeighborhoodDAL {
  async add(name, idDepartment) {
    try {
      const neighborhood = new Neighborhood();
      neighborhood.propDepartment = idDepartment;
      neighborhood.propName = name;

      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), neighborhood.propName);
      request.input("idDepartment", sql.Int, neighborhood.propDepartment);

      const result = await request.execute("AddNeighborhood");

      return result;
    } catch (error) {
      throw error;
    }
  }

  async update(name, idDepartment) {
    try {
      const neighborhood = new Neighborhood();
      neighborhood.propDepartment = idDepartment;
      neighborhood.propName = name;

      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), neighborhood.propName);
      request.input("idDepartment", sql.Int, neighborhood.propDepartment);

      const result = await request.execute("AddNeighborhood");

      return result;
    } catch (error) {
      throw error;
    }
  }

  async update(name, idDepartment) {
    try {
      const neighborhood = new Neighborhood();
      neighborhood.propDepartment = idDepartment;
      neighborhood.propName = name;

      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), neighborhood.propName);
      request.input("idDepartment", sql.Int, neighborhood.propDepartment);

      const result = await request.execute("UpdateNeighborhood");

      return result;
    } catch (error) {
      throw error;
    }
  }

  async delete(name) {
    try {
      const neighborhood = new Neighborhood();

      neighborhood.propName = name;

      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), neighborhood.propName);

      const result = await request.execute("DeleteNeighborhood");

      return result;
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

      return result.recordset;
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

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }

  async getNeighborhoodByName(name) {
    try {
      const neighborhood = new Neighborhood();
      neighborhood.propName = name;

      const ps = new sql.PreparedStatement(connection.pool);
      ps.input("name", sql.VarChar(30));

      await ps.prepare("select * from neighborhoods where name=@name");

      const result = await ps.execute({ name: neighborhood.propName });
      await ps.unprepare();

      return result.recordset;
    } catch (error) {
      throw error;
    }
  }
}
