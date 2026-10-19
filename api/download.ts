import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from './_lib.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  await sql`update portfolio set data = jsonb_set(data, '{profile,resumeDownloads}',
            to_jsonb(coalesce((data #>> '{profile,resumeDownloads}')::int, 0) + 1)) where id = 1`;
  res.json({ ok: true });
}