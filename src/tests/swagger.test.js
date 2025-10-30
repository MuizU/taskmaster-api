import request from 'supertest';
import createApp from '../app.js';

const app = createApp();

describe('Swagger Integration', () => {
  it('should serve Swagger UI at /api-docs', async () => {
    const res = await request(app).get('/api-docs');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Swagger UI');
  });

  it('should serve OpenAPI spec at /api-docs.json or /api-docs/swagger.json', async () => {
    // Try common endpoints for raw spec
    const endpoints = ['/api-docs.json', '/api-docs/swagger.json'];
    let found = false;
    for (const ep of endpoints) {
      const res = await request(app).get(ep);
      if (res.status === 200 && res.body.openapi) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });
});
