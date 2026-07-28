import pool from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [projects] = await pool.query('SELECT * FROM projects ORDER BY sort_order ASC') as any;
    const [images] = await pool.query('SELECT * FROM project_images ORDER BY sort_order ASC') as any;

    const projectsWithImages = projects.map((p: any) => ({
      ...p,
      images: images.filter((img: any) => img.project_id === p.id),
    }));

    return Response.json(projectsWithImages);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;

    const [maxOrder] = await pool.query('SELECT COALESCE(MAX(sort_order), -1) as maxOrder FROM projects') as any;
    const sortOrder = maxOrder[0].maxOrder + 1;

    const [result] = await pool.query(
      'INSERT INTO projects (title, description, sort_order) VALUES (?, ?, ?)',
      [title, description, sortOrder]
    ) as any;

    return Response.json({ success: true, id: result.insertId });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
