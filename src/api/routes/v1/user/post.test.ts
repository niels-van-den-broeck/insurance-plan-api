import { Collection } from 'mongodb';

import mongoose from 'mongoose';
import request from 'supertest';

import buildApp from '../../../../app';
import Users from '../../../../domain/models/User';

import * as mongooseHelpers from '../../../../test/mongoose-helpers';

describe('POST /api/v1/login', () => {
  const qoverUser = new Users({
    userName: 'Qover',
    password: '$2b$10$jV8wR8xXEvitK2XoLZ21qOvlpkOuGcOoaWTqZpRmARBMFxpFnENom',
  });

  beforeAll(() => mongooseHelpers.connect());
  beforeAll(() => mongooseHelpers.dropCollections('users'));

  afterAll(() => mongooseHelpers.disconnect());

  beforeAll(async () => {
    await qoverUser.save();
  });

  beforeEach(() => mongooseHelpers.dropCollections('sessions'));

  function getSessionCollection(): Promise<Collection> {
    return new Promise((resolve) => {
      mongoose.connection.db.collection('sessions', { strict: true }, async (err, result) => {
        resolve(result);
      });
    });
  }

  function act({
    userName = 'Qover',
    password = 'Ninja',
  } = {}) {
    const app = buildApp();

    return request(app)
      .post('/api/v1/login')
      .send({
        userName,
        password,
      });
  }

  describe('HTTP 1.1/200 OK', () => {
    test('it returns the status if user exists and password is correct', async () => {
      await act().expect(200);
    });

    test('it sets the contenttype to application/json', async () => {
      await act().expect('Content-Type', /application\/json/);
    });

    test('it sets the session cookie on the response', async () => {
      const { header } = await act().expect(200);

      expect(header).toHaveProperty('set-cookie', [expect.stringContaining('Path=/')]);
    });

    test('it persists the session to the database', async () => {
      await act().expect(200);

      const sessionCollection = await getSessionCollection();

      const sessionDocument = await sessionCollection.findOne({});

      const parsedSession = JSON.parse(sessionDocument.session);

      expect(parsedSession).toHaveProperty('passport.user', qoverUser.id);
    });

    // TODO: Check cookie in detail..
  });

  describe('HTTP 1.1/401 Unauthorized', () => {
    test('it returns the status if user does not exist', async () => {
      await act({
        userName: 'NonExisting',
        password: 'Test',
      }).expect(401);
    });

    test('it returns the status if password is incorrect', async () => {
      await act({
        userName: 'Qover',
        password: 'NotANinja',
      }).expect(401);
    });

    test('guard it does not set the session cookie', async () => {
      const { header } = await act({
        userName: 'Qover',
        password: 'NotANinja',
      }).expect(401);

      expect(header).not.toHaveProperty('set-cookie');
    });
  });
});
