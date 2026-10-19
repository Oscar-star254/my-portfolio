import { timingSafeEqual } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { signToken } from './_lib.js';

const same = (a: string, b: string) => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, password } = req.body ?? {};
  const ok =
    same(String(email ?? '').toLowerCase(), String(process.env.ADMIN_EMAIL).toLowerCase()) &&
    same(String(password ?? ''), String(process.env.ADMIN_PASSWORD));
  if (!ok) {
    await new Promise(r => setTimeout(r, 800));
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ token: await signToken() });
}