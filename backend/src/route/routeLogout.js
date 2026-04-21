import express from "express";

export const RoutesLogout = express.Router();

RoutesLogout.post("/", (req, res) => {
  try {
    res.clearCookie("authenticationToken");
    res.clearCookie("authenticationRefreshToken");
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
});
