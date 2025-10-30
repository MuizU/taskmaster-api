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

describe("Security and Performance Middleware", () => {
  it("should set security headers with helmet", async () => {
    const app = createApp();
    const res = await request(app).get("/");
    expect(res.headers["x-dns-prefetch-control"]).toBe("off");
    expect(res.headers["x-frame-options"]).toBe("SAMEORIGIN");
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-xss-protection"]).toBeDefined();
  });

  it("should compress responses with compression", async () => {
    const app = createApp();
    const res = await request(app)
      .get("/")
      .set("Accept-Encoding", "gzip");
    expect(res.headers["content-encoding"]).toBe("gzip");
  });

  it("should rate limit requests", async () => {
    const app = createApp();
    // Simulate 101 requests to trigger rate limit (default: 100 per 15 min)
    let lastRes;
    for (let i = 0; i < 101; i++) {
      lastRes = await request(app).get("/");
    }
    expect(lastRes.status).toBe(429);
    expect(lastRes.text).toMatch(/Too many requests/i);
  });
});
