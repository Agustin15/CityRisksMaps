import { Participant } from "../model/participant.js";
import { ParticipantService } from "../service/participantService.js";
import { VerificationCode } from "../model/verificationCode.js";
import { VerificationCodeService } from "../service/verificationCodeService.js";
import { connection } from "../config/connection.js";
import sql from "mssql";

export const verifyParticipant = async (req, res) => {
  let transaction;
  try {
    const { email } = req.body;

    if (!process.env.EMAIL_FROM) throw new Error("EMAIL_FROM no declarada");
    if (!process.env.APP_PASSWORD) throw new Error("APP_PASSWORD no declarada");

    const participant = new Participant(email);

    const participantFound = await ParticipantService.getParticipantByEmail(
      email
    );

    const verificationCode = new VerificationCode();
    let codeCreated = verificationCode.generateCode();
    verificationCode.code = codeCreated;
    verificationCode.expiration = verificationCode.generateExpiration();
    verificationCode.participant = participant;

    transaction = new sql.Transaction(connection.pool);

    await transaction.begin(4);

    if (!participantFound) {
      await ParticipantService.add(participant, transaction);
    }

    await VerificationCodeService.add(verificationCode, transaction);

    await VerificationCodeService.sendVerificationCode(codeCreated, email);

    await transaction.commit();

    res.status(200).json(true);
  } catch (error) {
    if (transaction) await transaction.rollback();

    res
      .status(error.cause ? error.cause.code : 404)
      .json({ messageError: error.message });
  }
};
