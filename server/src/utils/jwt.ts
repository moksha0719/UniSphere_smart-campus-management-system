import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types/auth.types';

const JWT_SECRET = process.env.JWT_SECRET || 'smart_campus_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generates a signed JSON Web Token (JWT) containing the user's identity and role.
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

/**
 * Verifies and decodes a JWT token.
 * Returns the decoded payload or null if the token is invalid or expired.
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}
