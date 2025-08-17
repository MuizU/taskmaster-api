import request from "supertest";
import app from "../app.js";
import { describe, expect } from "@jest/globals";

describe("GET /", () => {
  it("should return HELLO WORLD", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("HELLO WORLD");
  });
});
