import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, isAdmin } from './_lib.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body ?? {};
    if (!name || !email || !message || String(message).length > 5000)
      return res.status(400).json({ error: 'Invalid' });
    await sql`insert into messages (name, email, message)
              values (${String(name).slice(0, 200)}, ${String(email).slice(0, 200)}, ${String(message)})`;
    return res.json({ ok: true });
  }

  if (!(await isAdmin(req))) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    const rows = await sql`select id, name, email, message, created_at as date, read, starred
                           from messages order by created_at desc`;
    return res.json(rows);
  }
  if (req.method === 'PATCH') {
    const { id, read, starred } = req.body ?? {};
    await sql`update messages set read = coalesce(${read ?? null}, read),
              starred = coalesce(${starred ?? null}, starred) where id = ${id}`;
    return res.json({ ok: true });
  }
  if (req.method === 'DELETE') {
    await sql`delete from messages where id = ${String(req.query.id)}`;
    return res.json({ ok: true });
  }
  res.status(405).end();
}