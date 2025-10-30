import { prisma } from "../prisma.js";

export async function listTodosModel(userId = null) {
  if (userId) {
    return prisma.todo.findMany({
      where: { userId },
      orderBy: { id: "asc" },
    });
  }

  return prisma.todo.findMany({ orderBy: { id: "asc" } });
}

export async function createTodoModel({ title, completed = false, user_id = null }) {
  const data = {
    title,
    completed,
    userId: user_id ?? null,
  };

  return prisma.todo.create({ data });
}

export async function getTodoByIdModel(id) {
  return prisma.todo.findUnique({ where: { id } });
}

export async function updateTodoModel(id, { title, completed, user_id }) {
  const data = {};
  if (typeof title !== "undefined") data.title = title;
  if (typeof completed !== "undefined") data.completed = completed;
  if (typeof user_id !== "undefined") data.userId = user_id;

  return prisma.todo.update({ where: { id }, data });
}

export async function deleteTodoModel(id) {
  const res = await prisma.todo.deleteMany({ where: { id } });
  return res.count > 0;
}
