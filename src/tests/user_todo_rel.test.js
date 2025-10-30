import { prisma } from '../prisma.js';

describe('User-Todo Relationship', () => {
  let user;
  let todo;

  beforeAll(async () => {
    user = await prisma.user.create({
      data: { username: 'reluser', email: 'reluser@example.com' },
    });
  });

  afterAll(async () => {
    await prisma.todo.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
    await prisma.$disconnect();
  });

  it('should create a todo connected to a user', async () => {
    todo = await prisma.todo.create({
      data: { title: 'User-linked todo', userId: user.id },
    });
    expect(todo.userId).toBe(user.id);
  });

  it('should fetch todos with user info', async () => {
    const found = await prisma.todo.findMany({
      where: { userId: user.id },
      include: { user: true },
    });
    expect(found.length).toBeGreaterThan(0);
    expect(found[0].user).toBeDefined();
    expect(found[0].user.email).toBe('reluser@example.com');
  });
});
