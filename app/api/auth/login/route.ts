import pool from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return Response.json({ success: false, error: 'Username and password required' }, { status: 400 });
    }

    const hash = crypto.createHash('sha256').update(password).digest('hex');

    const [rows] = await pool.query(
      'SELECT id, username FROM admin_users WHERE username = ? AND password_hash = ? LIMIT 1',
      [username, hash]
    ) as any;

    if (rows && rows.length > 0) {
      return Response.json({ success: true, user: { id: rows[0].id, username: rows[0].username } });
    } else {
      return Response.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('Login error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
