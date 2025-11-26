import { ParticipantDAL } from "../dataAccess/participantDAL.js";

export class ParticipantService {
  static async add(participant) {
    try {
      if (!participant)
        throw new Error("Debe indicar un participante para agregar");

      const added = await ParticipantDAL.add(participant);

      return added;
    } catch (error) {
      throw error;
    }
  }

  static async getParticipantByEmail(email) {
    try {
      const result = await ParticipantDAL.getParticipantByEmail(email);

      if (result.length > 0) {
        return result[0];
      } else null;
    } catch (error) {
      throw error;
    }
  }
}
