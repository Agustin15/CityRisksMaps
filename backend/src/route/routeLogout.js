import express from "express";

export const RoutesLogout = express.Router();

RoutesLogout.post("/", (req, res) => {
  try {

    res.clearCookie("authenticationToken");
    res.clearCookie("authenticationRefreshToken");

    return res.status(200).json(true);
  } catch (error) {
    return res.status(502).json({ messageError: error.message });
  }
});
