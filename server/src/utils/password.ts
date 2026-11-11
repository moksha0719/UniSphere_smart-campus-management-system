import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hashes a plain-text password using bcrypt.
 * Never store plain text passwords in the database!
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compares a candidate plain password with a stored hash.
 * Returns true if they match, false otherwise.
 */
export async function comparePassword(plainPassword: string, storedHash: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, storedHash);
}
