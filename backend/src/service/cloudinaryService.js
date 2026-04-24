import { UserService } from "./userService.js";
import cloudinary from "../index.js";

export class CloudinaryService {
  static async uploadAvatar(avatarUploaded, idUser) {
    try {
      const userFound = await UserService.getUserById(idUser);

      if (!userFound)
        throw new Error("No se encontro el usuario en el sistema");

      const fileName = "avatar" + idUser + Date.now().toString();

      if (userFound.avatar) {
        await this.deleteAvatar(userFound.avatar);
      }

      const result = await cloudinary.uploader.upload(avatarUploaded.path, {
        folder: "CityRisksMapAvatars",
        public_id: fileName
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async deleteAvatar(avatarId) {
    try {
      const result = await cloudinary.uploader.destroy(avatarId);

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async getAvatar(avatarId) {
    try {
      const result = await cloudinary.api.resource(avatarId);
      return result.url;
    } catch (error) {
      throw error;
    }
  }
}
