import express from "express";

export const RoutesLogout = express.Router();

RoutesLogout.post("/", (req, res) => {
  try {
    res.clearCookie("authenticationToken");
    res.clearCookie("authenticationRefreshToken");

    res.status(200).json(true);
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
});
