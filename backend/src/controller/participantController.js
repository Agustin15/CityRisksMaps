import { Participant } from "../model/participant.js";
import { ParticipantService } from "../service/participantService.js";
import { VerificationCode } from "../model/verificationCode.js";
import { VerificationCodeService } from "../service/verificationCodeService.js";

const verifiyParticipant = async (req, res) => {
  try {
    const { email } = req.body;

    const participant = new Participant(email);

    const participantFound = await ParticipantService.getParticipantByEmail(
      email
    );

    if (!participantFound) {
      await ParticipantService.add(participant);
    }

    const verificationCode = new VerificationCode();
    verificationCode.expiration = verificationCode.generateExpiration();
    verificationCode.attempts = 0;
    verificationCode.participant = participant;

    while (true) {
      let codeCreated = verificationCode.generateCode();

      const codeAlreadyExist =
        await VerificationCodeService.getVerificationCode(codeCreated);

      if (!codeAlreadyExist) {
        verificationCode.code = code;
        break;
      }
    }
  } catch (error) {
    res.status(404).json({ messageError: error.message });
  }
};
