import { neon } from '@neondatabase/serverless';
import { SignJWT, jwtVerify } from 'jose';
import type { VercelRequest } from '@vercel/node';

export const sql = neon(process.env.DATABASE_URL!);
const secret = () => new TextEncoder().encode(process.env.JWT_SECRET!);

export const signToken = () =>
  new SignJWT({ role: 'admin' }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(secret());

export async function isAdmin(req: VercelRequest) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!token) return false;
  try { await jwtVerify(token, secret()); return true; } catch { return false; }
}