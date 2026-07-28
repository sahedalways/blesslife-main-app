import pool from '@/lib/db';
import crypto from 'crypto';

export async function PUT(request: Request) {
  try {
    const { currentUsername, currentPassword, newUsername, newPassword } = await request.json();

    if (!currentUsername || !currentPassword || !newUsername || !newPassword) {
      return Response.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    const currentHash = crypto.createHash('sha256').update(currentPassword).digest('hex');

    // Verify current credentials
    const [rows] = await pool.query(
      'SELECT id FROM admin_users WHERE username = ? AND password_hash = ? LIMIT 1',
      [currentUsername, currentHash]
    ) as any;

    if (!rows || rows.length === 0) {
      return Response.json({ success: false, error: 'Current password or username is incorrect' }, { status: 401 });
    }

    const userId = rows[0].id;
    const newHash = crypto.createHash('sha256').update(newPassword).digest('hex');

    // Update credentials
    await pool.query(
      'UPDATE admin_users SET username = ?, password_hash = ? WHERE id = ?',
      [newUsername, newHash, userId]
    );

    return Response.json({ success: true, message: 'Credentials updated successfully' });
  } catch (error: any) {
    console.error('Update credentials error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
       return Response.json({ success: false, error: 'Username already exists' }, { status: 400 });
    }
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
