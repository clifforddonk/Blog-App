import db from "@/config/db";

export const GET = async () => {
  try {
    const connection = await db();
    const [rows] = await connection.execute("SELECT NOW() AS currentTime");
    connection.end();

    return Response.json({ success: true, currentTime: rows[0].currentTime });
  } catch (error) {
    console.error("Database connection error:", error);
    return Response.json(
      { success: false, error: "Database connection failed" },
      { status: 500 }
    );
  }
};
