import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "@/models/user"; // ✅ Import createUser & getUserByEmail

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // Validate input fields
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
      });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user using createUser function
    const newUser = await createUser({
      name,
      email,
      hashedPassword, // ✅ Make sure it's 'hashedPassword'
      role: "user",
      provider: "credentials",
      providerId: null,
    });

    return new Response(
      JSON.stringify({ message: "Signup successful", user: newUser }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
