import db from "@/config/db";

export const createUser = async (
  name,
  email,
  hashedPassword,
  role = "user",
  provider = "credentials",
  providerId = null
) => {
  const query = `
    INSERT INTO users (name, email, password, role, provider, providerId, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;
  const values = [name, email, hashedPassword, role, provider, providerId];

  try {
    const [result] = await db.execute(query, values);
    return result.insertId; // Return user ID after creation
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = ?`;
  const [rows] = await db.execute(query, [email]);
  return rows.length > 0 ? rows[0] : null;
};
