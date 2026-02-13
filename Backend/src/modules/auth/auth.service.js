import bcrypt from "bcryptjs";
import db from "../../config/db.js";
import jwt from "jsonwebtoken";


const SALT_ROUNDS = 10;

export async function registerUser({ email, username, password, full_name }) {
  if (!email || !username || !password) {
    throw badRequest("Missing required fields");
  }

  email = email.toLowerCase();
  username = username.toLowerCase();

  if (!/^[a-z0-9_]{3,30}$/.test(username)) {
    throw badRequest("Invalid username format");
  }

  if (password.length < 8) {
    throw badRequest("Password must be at least 8 characters");
  }

  const emailExists = await db.query(
    "SELECT 1 FROM users WHERE email = $1",
    [email]
  );
  if (emailExists.rowCount > 0) {
    throw conflict("EMAIL_ALREADY_EXISTS");
  }

  const usernameExists = await db.query(
    "SELECT 1 FROM users WHERE username = $1",
    [username]
  );
  if (usernameExists.rowCount > 0) {
    throw conflict("USERNAME_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await db.query(
    `
    INSERT INTO users (email, username, password_hash, full_name)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, username, full_name, created_at
    `,
    [email, username, passwordHash, full_name || null]
  );

  return result.rows[0];
}

export async function loginUser({ email, password }) {
  if (!email || !password) {
    throw badRequest("Email and password required");
  }

  email = email.toLowerCase();

  const result = await db.query(
    `
    SELECT id, email, username, full_name, password_hash
    FROM users
    WHERE email = $1 AND is_active = TRUE
    `,
    [email]
  );

  if (result.rowCount === 0) {
    throw unauthorized("Invalid credentials");
  }

  const user = result.rows[0];

  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    throw unauthorized("Invalid credentials");
  }

        const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return {
        token,
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            full_name: user.full_name
        }
        };

}

/* -------- helpers -------- */

function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

function conflict(code) {
  const err = new Error(code);
  err.status = 409;
  return err;
}

function unauthorized(message) {
  const err = new Error(message);
  err.status = 401;
  return err;
}
