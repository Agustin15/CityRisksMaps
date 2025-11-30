import nodemailer from "nodemailer";
import { VerificationCodeDAL } from "../dataAccess/verificationCodeDAL.js";
import bcrypt from "bcrypt";

export class VerificationCodeService {
  static async add(verificationCode, transaction) {
    try {
      if (!verificationCode)
        throw new Error("Debe indicar un codigo de verificacion para agregar");

      const salt = await bcrypt.genSalt(10);
      verificationCode.code = await bcrypt.hash(verificationCode.code, salt);

      const added = VerificationCodeDAL.add(verificationCode, transaction);

      return added;
    } catch (error) {
      throw error;
    }
  }

  static async getVerificationCodeMostRecentlyByEmail(email) {
    try {
      const result =
        await VerificationCodeDAL.getVerificationCodeMostRecentlyByEmail(email);

      if (result.length > 0) {
        return result[0];
      } else null;
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
              <p>Ingrese este codigo para verificar la encuesta</p>
          ${code}

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
