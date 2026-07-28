import pool from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { image_url } = body;

    const [maxOrder] = await pool.query(
      'SELECT COALESCE(MAX(sort_order), -1) as maxOrder FROM project_images WHERE project_id = ?',
      [id]
    ) as any;
    const sortOrder = maxOrder[0].maxOrder + 1;

    const [result] = await pool.query(
      'INSERT INTO project_images (project_id, image_url, sort_order) VALUES (?, ?, ?)',
      [id, image_url, sortOrder]
    ) as any;

    return Response.json({ success: true, id: result.insertId });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await params; // consume params
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');

    if (!imageId) {
      return Response.json({ error: 'imageId is required' }, { status: 400 });
    }

    await pool.query('DELETE FROM project_images WHERE id = ?', [imageId]);
    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
