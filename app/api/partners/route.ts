import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM partners ORDER BY sort_order ASC') as any;
    return Response.json(rows);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, logo_url } = body;

    const [maxOrder] = await pool.query('SELECT COALESCE(MAX(sort_order), -1) as maxOrder FROM partners') as any;
    const sortOrder = maxOrder[0].maxOrder + 1;

    const [result] = await pool.query(
      'INSERT INTO partners (name, logo_url, sort_order) VALUES (?, ?, ?)',
      [name, logo_url, sortOrder]
    ) as any;

    return Response.json({ success: true, id: result.insertId });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
