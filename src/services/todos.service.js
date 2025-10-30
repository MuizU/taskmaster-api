import {
  listTodosModel,
  createTodoModel,
  getTodoByIdModel,
  updateTodoModel,
  deleteTodoModel,
} from "../models/todos.model.js";

export async function listTodos(userId = null) {
  return listTodosModel(userId);
}

export async function createTodo(payload) {
  return createTodoModel(payload);
}

export async function getTodoById(id) {
  return getTodoByIdModel(id);
}

export async function updateTodo(id, payload) {
  return updateTodoModel(id, payload);
}

export async function deleteTodo(id) {
  return deleteTodoModel(id);
}
