import sql from "mssql";
import { connection } from "../config/connection.js";

export class ParticipantDAL {
  static async add(participant) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("email", sql.VarChar, participant.email);

      const result = await request.execute("AddParticipant");

      switch (result.returnValue) {
        case -1:
          throw new Error("Ingrese un correo valido");
        case -2:
          throw new Error("Ya hay registro este correo en el sistema");

        case -3:
          throw new Error("Error inesperado al agregar participante");
      }

      return result.returnValue;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getParticipantByEmail(email) {
    try {
      const request = new sql.Request(connection.pool);

      request.input("email", sql.VarChar, email);

      const result = await request.execute("ParticipantByEmail");

      return result.recordset;
    } catch (error) {
      throw new Error(error);
    }
  }
}
