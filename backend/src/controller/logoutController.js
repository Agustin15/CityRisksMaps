export const logout = (req, res) => {
  try {
    res.clearCookie("authenticacionToken");
    res.clearCookie("authenticacionRefreshToken");

    res.status(200).json(true);
  } catch (error) {
    res.status(502).json({ messageError: error.message });
  }
};
