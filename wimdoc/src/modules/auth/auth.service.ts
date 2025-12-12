import bcrypt from "bcrypt";
import { db } from "../../core/db.js";

const ADMIN_TABLE = "admins";
const USER_TABLE = "users";

// --- Password helpers ---
export async function hashPassword(raw: string): Promise<string> {
  return bcrypt.hash(raw, 10);
}

export async function comparePassword(raw: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(raw, hashed);
}

// --- Finders ---
export async function findAdminByUsername(username: string): Promise<any | null> {
  const result = await db.query(
    `SELECT * FROM ${ADMIN_TABLE} WHERE username = $1 LIMIT 1`,
    [username]
  );
  return result.rows[0] || null;
}

export async function findUserByUsername(username: string): Promise<any | null> {
  const result = await db.query(
    `SELECT * FROM ${USER_TABLE} WHERE username = $1 LIMIT 1`,
    [username]
  );
  return result.rows[0] || null;
}

// --- Seed initial accounts if DB is empty ---
export async function seedInitialAccounts(): Promise<void> {
  const adminCheck = await db.query(`SELECT COUNT(*) FROM ${ADMIN_TABLE}`);
  const userCheck = await db.query(`SELECT COUNT(*) FROM ${USER_TABLE}`);

  if (Number(adminCheck.rows[0].count) === 0) {
    const hashed = await hashPassword("admin123");
    await db.query(
      `INSERT INTO ${ADMIN_TABLE} (username, password_hash)
       VALUES ($1, $2)`,
      ["superadmin", hashed]
    );
    console.log("✨ Seeded admin account: superadmin / admin123");
  }

  if (Number(userCheck.rows[0].count) === 0) {
    const demoUsers = ["yash", "arjun", "priya", "lavanya", "darsin"];
    for (const u of demoUsers) {
      const pass = await hashPassword("user123");
      await db.query(
        `INSERT INTO ${USER_TABLE} (username, password_hash)
         VALUES ($1, $2)`,
        [u, pass]
      );
    }
    console.log("✨ Seeded 5 demo users (password = user123)");
  }
}