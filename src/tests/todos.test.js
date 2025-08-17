import request from "supertest";
import { describe, expect, jest } from "@jest/globals";
import createApp from "../app.js";

function makeMockTodoService() {
  return {
    listTodos: jest.fn(),
    createTodo: jest.fn(),
    getTodoById: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
  };
}

describe("Todos router (mocked service)", () => {
  beforeAll(() => jest.spyOn(console, "error").mockImplementation(() => {}));
  afterAll(() => console.error.mockRestore());

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
    svc.createTodo.mockResolvedValue({
      id: 123,
      title: "Task -1",
      completed: false,
    });

    const app = createApp({ todosService: svc });
    const res = await request(app).post("/todos").send({ title: "Task -1" });

    expect(res.status).toBe(201);
    expect(res.headers.location).toBe("/todos/123");
    expect(res.body.todo.id).toBe(123);
    expect(svc.createTodo).toHaveBeenCalledWith({
      title: "Task -1",
      completed: false,
    });
  });
  it("PUT /todos/:id returns 400 on invalid payload", async () => {
    const svc = makeMockTodoService();
    const app = createApp({ todosService: svc });

    const res = await request(app).put("/todos/1").send({ title: "X" });

    expect(res.status).toBe(400);
    expect(svc.updateTodo).not.toHaveBeenCalled();
  });

  it("PUT /todos/:id returns 404 when not found", async () => {
    const svc = makeMockTodoService();
    svc.updateTodo.mockResolvedValue(null);

    const app = createApp({ todosService: svc });
    const res = await request(app)
      .put("/todos/999")
      .send({ title: "Valid Title", completed: true });

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
