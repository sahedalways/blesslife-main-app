import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT setting_key, setting_value FROM settings') as any;
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.setting_key] = row.setting_value;
    }
    return Response.json(settings);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const conn = await pool.getConnection();
    try {
      for (const [key, value] of Object.entries(body)) {
        await conn.query(
          'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
          [key, value, value]
        );
      }
      return Response.json({ success: true });
    } finally {
      conn.release();
    }
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
