import { prisma } from "../prisma.js";

export async function listUsersModel() {
  return prisma.user.findMany({ orderBy: { id: "asc" } });
}

export async function createUserModel({ username, email }) {
  return prisma.user.create({ data: { username, email } });
}

export async function getUserByIdModel(id) {
  return prisma.user.findUnique({ where: { id } });
}

export async function updateUserModel(id, { username, email }) {
  const data = {};
  if (typeof username !== "undefined") data.username = username;
  if (typeof email !== "undefined") data.email = email;

  return prisma.user.update({ where: { id }, data });
}

export async function deleteUserModel(id) {
  const res = await prisma.user.deleteMany({ where: { id } });
  return res.count > 0;
}
