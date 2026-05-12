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

export const sendMailToConfirmNewEmail = async (email, name, token) => {
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
      to: name + " <" + email + ">",
      subject: "Confirmacion del nuevo correo electronico",
      html: `
      <h3>Hola ${name}!</h3>
      <br>
      </p>Hemos recibido una solicitud para cambiar el correo electronico de su cuenta.</p>
      <br>
      <a href="${LOCALHOST_FRONTEND}/admin/confirmar-correo/${token}">Confirma tu correo electronico</a>
      <br>
      <p>El link sera valido durante 2 horas antes de expirar</p>
      `
    });

    if (!info.messageId)
      throw new Error("Error al enviar correo de confirmacion");
  } catch (error) {
    throw error;
  }
};

const sendVerificationCode = async (code, email) => {
  try {
    if (!EMAIL_FROM) throw new Error("EMAIL_FROM no declarado");
    if (!APP_PASSWORD) throw new Error("APP_PASSWORD no declarado");
    
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
      subject: "Verificacion de encuesta sobre percepcion de seguridad barrio",
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
};
