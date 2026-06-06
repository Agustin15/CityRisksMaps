import nodemailer from "nodemailer";

export const sendConsultation = async (req, res) => {
  try {
    if (!req.body) throw new Error("Cuerpo de solicitud no defindo");

    const { name, email, message } = req.body;
    let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (name.length == 0) throw new Error("Nombre no puede estar vacio");
    if (message.length == 0)
      throw new Error("Mensaje no puede estar vacio");
    if (!regexEmail.test(email)) throw new Error("Formato de correo no valido");

    const EMAIL_FROM = process.env.EMAIL_FROM;
    const APP_PASSWORD = process.env.APP_PASSWORD;
    const LOCALHOST_FRONTEND = process.env.LOCALHOST_FRONTEND;

    if (!EMAIL_FROM) throw new Error("EMAIL_FROM no declarado");
    if (!APP_PASSWORD) throw new Error("APP_PASSWORD no declarado");

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
      from: "SoporteIndiceDelitosMdveoUy" + " <" + EMAIL_FROM + ">",
      to: EMAIL_FROM,
      subject: "Mensaje de usuario enviado desde la app",
      html: `
      <h3>Hola ${name}! alguien ha enviado un mensaje desde la app.</h3>
      <h4>Datos del usuario:<h4>
      <p>Nombre:${name}<p>
      <p>Correo:${email}<p>
      <p>Mensaje:${message}<p>
      `
    });

    if (!info.messageId) throw new Error("Error al enviar consulta");

    return res.status(200).json(true);
  } catch (error) {
    return res.status(502).json({ messageError: error.message });
  }
};
