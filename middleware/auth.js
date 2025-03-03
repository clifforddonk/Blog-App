import jwt from "jsonwebtoken";

export const verifyToken = async (req) => {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) throw new Error("Unauthorized");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};
