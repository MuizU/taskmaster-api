import { prisma } from '../prisma.js';

describe('Prisma Integration', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should connect to the database', async () => {
    const result = await prisma.$queryRaw`SELECT 1`;
    expect(result).toBeDefined();
  });

  it('should perform basic CRUD on User', async () => {
    // Create
    const user = await prisma.user.create({
      data: { email: 'testuser@example.com', name: 'Test User' },
    });
    expect(user).toHaveProperty('id');

    // Read
    const found = await prisma.user.findUnique({ where: { id: user.id } });
    expect(found).not.toBeNull();

    // Update
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name: 'Updated User' },
    });
    expect(updated.name).toBe('Updated User');

    // Delete
    const deleted = await prisma.user.delete({ where: { id: user.id } });
    expect(deleted.id).toBe(user.id);
  });
});
