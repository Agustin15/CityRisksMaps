import nodemailer from "nodemailer";
import { VerificationCodeDAL } from "../dataAccessLayer/verificationCodeDAL.js";
import bcrypt from "bcrypt";

export class VerificationCodeService {
  static async add(verificationCode) {
    try {
      if (!verificationCode)
        throw new Error("Debe indicar un codigo de verificacion para agregar");

      const salt = await bcrypt.genSalt(10);
      verificationCode.code = await bcrypt.hash(verificationCode.code, salt);

      await VerificationCodeDAL.add(verificationCode);
    } catch (error) {
      throw error;
    }
  }

  static async update(verificationCode) {
    try {
      if (!verificationCode)
        throw new Error(
          "Debe indicar un codigo de verificacion para actualizar"
        );

      await VerificationCodeDAL.update(verificationCode);
    } catch (error) {
      throw error;
    }
  }
  static async delete(code) {
    try {
      await VerificationCodeDAL.delete(code);
    } catch (error) {
      throw error;
    }
  }

  static async getVerificationCodeMostRecentlyByUser(idUser) {
    try {
      const result =
        await VerificationCodeDAL.getVerificationCodeMostRecentlyByUser(idUser);

      if (result.length > 0) {
        return result[0];
      } else null;
    } catch (error) {
      throw error;
    }
  }
  static async getAllVerificationCodes() {
    try {
      const result = await VerificationCodeDAL.getAllVerificationCodes();

      return result;
    } catch (error) {
      throw error;
    }
  }
  static async getVerificationCodesOffset(offset) {
    try {
      const result =
        await VerificationCodeDAL.getVerificationCodesOffset(offset);

      return result;
    } catch (error) {
      throw error;
    }
  }
  static async getVerificationCodesByUser(idUser) {
    try {
      const result =
        await VerificationCodeDAL.getVerificationCodesByUser(idUser);

      return result;
    } catch (error) {
      throw error;
    }
  }
  static async getVerificationCodesOffset(idUser, offset) {
    try {
      const result = await VerificationCodeDAL.getVerificationCodesByUserOffset(
        idUser,
        offset
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  static async sendVerificationCode(code, email) {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_FROM,
          pass: process.env.APP_PASSWORD
        }
      });

      const info = await transporter.sendMail({
        from: '"CityRisksMap" <cityrisksmap@gmail.com>',
        to: email,
        subject:
          "Verificacion de encuesta sobre percepcion de seguridad barrio",
        html: `<p>¡Hola!, hemos recibido una solicitud para verificar su correo para proseguir
              con la encuesta.</p>
              <p>Ingrese este codigo para la verificacion</p>
          <h3>${code}</h3>

          <p>El codigo caducara en 24 horas</p>

          <p>Si usted no hizo esta solicitud de verificacion, contactenos</p> 
        `
      });

      return info.messageId;
    } catch (error) {
      throw error;
    }
  }
}
