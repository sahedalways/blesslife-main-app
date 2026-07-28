import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [about] = await pool.query('SELECT * FROM about LIMIT 1') as any;
    const [missionVision] = await pool.query('SELECT * FROM mission_vision ORDER BY type') as any;
    const [chairman] = await pool.query('SELECT * FROM chairman LIMIT 1') as any;

    const mission = missionVision.find((mv: any) => mv.type === 'mission') || null;
    const vision = missionVision.find((mv: any) => mv.type === 'vision') || null;

    return Response.json({
      about: about[0] || null,
      mission,
      vision,
      chairman: chairman[0] || null,
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { section, data } = body;

    if (section === 'about') {
      await pool.query(
        'UPDATE about SET title = ?, description = ?, image_url = ? WHERE id = ?',
        [data.title, data.description, data.image_url, data.id]
      );
    } else if (section === 'mission') {
      await pool.query(
        'UPDATE mission_vision SET description = ?, image_url = ? WHERE type = "mission"',
        [data.description, data.image_url]
      );
    } else if (section === 'vision') {
      await pool.query(
        'UPDATE mission_vision SET description = ?, image_url = ? WHERE type = "vision"',
        [data.description, data.image_url]
      );
    } else if (section === 'chairman') {
      await pool.query(
        'UPDATE chairman SET name = ?, title = ?, message = ?, image_url = ? WHERE id = ?',
        [data.name, data.title, data.message, data.image_url, data.id]
      );
    }

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
