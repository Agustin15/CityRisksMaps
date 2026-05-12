import { User } from "../entity/user.js";
import { UserService } from "../service/userService.js";
import { verifyConfirmEmailToken } from "./authentication.js";
import crypto from "crypto";

export const confirmEmail = async (req, res) => {
  try {
    const { idUser, newEmail } = await verifyConfirmEmailToken(req, res);

    await UserService.updateEmailByIdUser(idUser, newEmail);

    return res.status(200).json(true);
  } catch (error) {
    return res
      .status(error.cause ? error.cause.code : 502)
      .json({ messageError: error.message });
  }
};
