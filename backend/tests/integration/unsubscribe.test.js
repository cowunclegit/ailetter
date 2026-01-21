const request = require('supertest');
const app = require('../../src/server');
const db = require('../../src/db');
const Subscriber = require('../../src/models/Subscriber');

describe('Unsubscribe Integration', () => {
  let subscriber;

  beforeEach(async () => {
    // Clean tables
    await new Promise(res => db.run("DELETE FROM subscribers", res));
    await new Promise(res => db.run("DELETE FROM subscriber_categories", res));

    // Seed data
    subscriber = await Subscriber.create({
      name: 'John Doe',
      email: 'john@example.com',
      is_subscribed: true
    });
  });

  it('POST /api/subscribers/unsubscribe/:uuid should unsubscribe the user', async () => {
    const res = await request(app)
      .post(`/api/subscribers/unsubscribe/${subscriber.uuid}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Unsubscribed successfully');

    const updated = await Subscriber.findById(subscriber.id);
    expect(updated.is_subscribed).toBe(false);
  });

  it('POST /api/subscribers/unsubscribe/:uuid should return 404 for invalid UUID', async () => {
    const res = await request(app)
      .post('/api/subscribers/unsubscribe/invalid-uuid')
      .send();

    expect(res.status).toBe(404);
  });
});
