function checkRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unathorized Access" });
    }
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Access Denieds" });
    }
    next();
  };
}

module.exports = checkRole;
