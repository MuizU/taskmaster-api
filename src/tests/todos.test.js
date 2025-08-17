import request from "supertest";
import app from "../app.js";
import { pool } from "../db.js";
import { describe, expect, jest } from "@jest/globals";
import createApp from "../app.js";

function makeMockTodoService() {
  return {
    listTodos: jest.fn(),
    createTodos: jest.fn(),
    getTodoById: jest.fn(),
    updateTodoById: jest.fn(),
    deleteTodo: jest.fn(),
  };
}

describe("Todos router (mocked service)", () => {
  it("Get /todos return rows", async () => {
    const svc = makeMockTodoService();
    const values = [
      { id: 1, title: "Mock1", completed: false },
      { id: 2, title: "Test2", completed: true },
    ];
    svc.listTodos.mockResolvedValue(values);

    const app = createApp({ todosService: svc });
    const res = await request(app).get("/todos");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(values);
    expect(svc.listTodos).toHaveBeenCalledTimes(1);
  });

  it("POST /todos validates and creates", async () => {
    const svc = makeMockTodoService();
    svc.createTodos.mockResolvedValue({
      id: 123,
      title: "Task -1",
      completed: false,
    });

    const app = createApp({ todosService: svc });
    const res = await request(app).post("/todos");

    expect(res.status).toBe(201);
    expect(res.headers.location).toBe("/todos/42");
    expect(res.body.todo.id).toBe(42);
    expect(svc.createTodos).toHaveBeenCalledWith({ title: "Task -1" });
  });

  it("PUT /todos/:id returns 404 when not found", async () => {
    const svc = makeMockTodoService();
    svc.updateTodo.mockResolvedValue(null);

    const app = createApp({ todosService: svc });
    const res = await request(app)
      .put("/todos/999")
      .send({ title: "X", completed: true });

    expect(res.status).toBe(404);
  });

  it("DELETE /todos/:id returns 204", async () => {
    const svc = makeMockTodoService();
    svc.deleteTodo.mockResolvedValue(true);

    const app = createApp({ todosService: svc });
    const res = await request(app).delete("/todos/1");

    expect(res.status).toBe(204);
  });
});
