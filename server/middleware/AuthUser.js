// /api/middleware/AuthUser.js
import prisma from "../config/prisma.js";

export const verifyUser = async (req, res, next) => {
  try {
    const userUuid = req.session?.userId;
    if (!userUuid) {
      return res.status(401).json({ message: "Unauthorized, Please Log In" });
    }

    const user = await prisma.user.findUnique({
      where: { uuid: userUuid },
      select: { id: true, uuid: true, role: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    req.userId = user.id;      // numeric id (internal)
    req.userUuid = user.uuid;  // uuid (publik)
    req.role = user.role;

    return next();
  } catch (e) {
    console.error("verifyUser error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const adminOnly = async (req, res, next) => {
  try {
    const userUuid = req.session?.userId;
    if (!userUuid) return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { uuid: userUuid },
      select: { role: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied, Admins only" });
    }

    return next();
  } catch (e) {
    console.error("adminOnly error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
};
