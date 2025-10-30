import {
  listUsersModel,
  createUserModel,
  getUserByIdModel,
  updateUserModel,
  deleteUserModel,
} from "../models/users.model.js";

export async function listUsers() {
  return listUsersModel();
}

export async function createUser(payload) {
  return createUserModel(payload);
}

export async function getUserById(id) {
  return getUserByIdModel(id);
}

export async function updateUser(id, payload) {
  return updateUserModel(id, payload);
}

export async function deleteUser(id) {
  return deleteUserModel(id);
}
