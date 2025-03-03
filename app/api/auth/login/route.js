import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "@/models/user";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
      });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await createUser({ name, email, password: hashedPassword });

    return new Response(
      JSON.stringify({ message: "Signup successful", user: newUser }),
      { status: 201 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
