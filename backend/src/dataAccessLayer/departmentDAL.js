import { connection } from "../config/connection.js";
import sql from "mssql";

export class DepartmentDAL {
  static async add(departament) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar(30), departament.name);

      const result = await request.execute("AddDepartment");

      if (result.returnValue == -1)
        throw new Error(
          "Nombre del departmento no debe tener mas de 30 caracteres",
          {
            cause: { code: 400 }
          }
        );

      if (result.returnValue == -2)
        throw new Error("Ya hay registrado un departmento con este nombre", {
          cause: { code: 409 }
        });
      else if (result.returnValue == -3)
        throw new Error("Error inesperado al agregar departmento", {
          cause: { code: 502 }
        });
    } catch (error) {
      throw new Error(error);
    }
  }

  static async update(departament) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idDepartment", sql.Int, departament.idDepartment);
      request.input("name", sql.VarChar(30), departament.name);

      const result = await request.execute("UpdateDepartment");

      switch (result.returnValue) {
        case -1:
          throw new Error(
            "Nombre del departmento no debe tener mas de 30 caracteres",
            {
              cause: { code: 400 }
            }
          );
        case -2:
          throw new Error("Departmento con este ID no encontrado", {
            cause: { code: 404 }
          });
        case -3:
          throw new Error("Ya hay registrado un departamento con este nombre", {
            cause: { code: 409 }
          });

        case -4:
          throw new Error("Error inesperado al actualizar departamento", {
            cause: { code: 502 }
          });
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  static async delete(idDepartment) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idDepartment", sql.Int, idDepartment);

      const result = await request.execute("DeleteDepartment");
      if (result.returnValue == -1)
        throw new Error("Departmento con este ID no encontrado", {
          cause: { code: 404 }
        });
      else if (result.returnValue == -2)
        throw new Error("Error inesperado al eliminar departamento", {
          cause: { code: 502 }
        });
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getDepartmentByName(name) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("name", sql.VarChar, name);

      const result = await request.execute("DepartmentByName");

      result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getDepartmentById(idDepartment) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("idDepartment", sql.Int, idDepartment);

      const result = await request.execute("DepartmentById");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getDepartments() {
    try {
      const request = new sql.Request(connection.pool);

      const result = await request.execute("AllDepartments");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }
  static async getDepartmentsOffset(offset) {
    try {
      const request = new sql.Request(connection.pool);
      request.input("offset", sql.Int, offset);

      const result = await request.execute("DepartmentsOffset");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }
}
