import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM notices ORDER BY createdAt DESC') as any;
    return Response.json(rows);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, message, active } = body;

    const [result] = await pool.query(
      'INSERT INTO notices (title, message, active) VALUES (?, ?, ?)',
      [title, message, active !== false]
    ) as any;

    return Response.json({ success: true, id: result.insertId });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
