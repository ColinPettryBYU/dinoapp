import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:5173"],
  })
);
app.use(express.json());

const initDatabase = async () => {
  await pool.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS username VARCHAR(100)
  `);

  await pool.query(`
    UPDATE users
    SET username = LOWER(REGEXP_REPLACE(first_name || last_name, '\\s+', '', 'g'))
    WHERE username IS NULL OR username = ''
  `);
};

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get("/users", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, first_name, last_name, email, role, username, created_at FROM users ORDER BY id"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch("/users/:id", async (req, res) => {
  const id = Number(req.params.id);
  const username = typeof req.body.username === "string" ? req.body.username.trim() : "";

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const result = await pool.query(
      `UPDATE users
       SET username = $1
       WHERE id = $2
       RETURNING id, first_name, last_name, email, role, username, created_at`,
      [username, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const startServer = async () => {
  try {
    await initDatabase();
    app.listen(port, () => {
      console.log(`Backend server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to initialize backend:", error.message);
    process.exit(1);
  }
};

startServer();
