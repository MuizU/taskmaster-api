import request from "supertest";
import { describe, expect } from "@jest/globals";
import createApp from "../app.js";

describe("GET /", () => {
  it("should return HELLO WORLD", async () => {
    const app = createApp();
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("HELLO WORLD");
  });
});
