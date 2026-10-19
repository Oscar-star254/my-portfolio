import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sql, isAdmin } from './_lib.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (req.method === 'GET') {
      const rows = await sql`select data from portfolio where id = 1`;
      const full = rows[0]?.data;
      if (!full) return res.json(null);

      const { messages: _m, ...rest } = full;

      // The logged-in admin gets everything, including hidden items
      if (await isAdmin(req)) return res.json(rest);

      // Visitors only get what you've marked as visible
      const hidden = new Set(
        (rest.sections ?? []).filter((s: any) => !s.visible).map((s: any) => s.id)
      );

      return res.json({
        ...rest,
        skills: hidden.has('skills') ? [] : rest.skills ?? [],
        experience: hidden.has('experience') ? [] : rest.experience ?? [],
        education: hidden.has('education') ? [] : rest.education ?? [],
        projects: hidden.has('projects')
          ? []
          : (rest.projects ?? []).filter((p: any) => p.status === 'published'),
        testimonials: hidden.has('testimonials')
          ? []
          : (rest.testimonials ?? []).filter((t: any) => t.approved),
        profile: { ...rest.profile, resumeDownloadLog: [] },
      });
    }

    if (req.method === 'PUT') {
      if (!(await isAdmin(req))) return res.status(401).json({ error: 'Unauthorized' });

      const data = req.body;
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return res.status(400).json({ error: 'Bad data' });
      }

      const { messages: _m, ...clean } = data;
      await sql`insert into portfolio (id, data) values (1, ${JSON.stringify(clean)}::jsonb)
                on conflict (id) do update set data = excluded.data, updated_at = now()`;
      return res.json({ ok: true });
    }

    return res.status(405).end();
  } catch (err) {
    console.error('portfolio api error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}