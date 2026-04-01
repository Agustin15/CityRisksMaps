import nodemailer from "nodemailer";

export const sendActivateUserMail = async (emailUser, name, token) => {
  try {
    const EMAIL_FROM = process.env.EMAIL_FROM;
    const APP_PASSWORD = process.env.APP_PASSWORD;
    const LOCALHOST_FRONTEND = process.env.LOCALHOST_FRONTEND;

    if (!EMAIL_FROM) throw new Error("EMAIL_FROM no declarado");
    if (!APP_PASSWORD) throw new Error("APP_PASSWORD no declarado");
    if (!LOCALHOST_FRONTEND) throw new Error("LOCALHOST_FRONTEND no declarado");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: EMAIL_FROM,
        pass: APP_PASSWORD
      }
    });

    const info = await transporter.sendMail({
      from: "IndiceDelitosMdveoSoporte" + " <" + EMAIL_FROM + ">",
      to: name + " <" + emailUser + ">",
      subject: "Activacion de usuario",
      html: `
      <h3>IndiceDelitosMdveo le da la bienvenida a ${name}! Para activar su usuario</h3>
      </p>por favor haz clic en el siguiente enlace:</p>
      <br>
      <a href="${LOCALHOST_FRONTEND}/admin/activar-usuario/${token}">Activar usuario</a>
      `
    });

    if (!info.messageId)
      throw new Error("Error al enviar correo de activacion");
  } catch (error) {
    throw error;
  }
};
