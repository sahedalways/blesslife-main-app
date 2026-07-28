import { seedDatabase } from '@/lib/seed';

export async function POST() {
  const result = await seedDatabase();
  return Response.json(result, { status: result.success ? 200 : 500 });
}
