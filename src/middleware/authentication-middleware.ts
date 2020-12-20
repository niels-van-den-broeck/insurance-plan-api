import { Express } from 'express';
import { Connection } from 'mongoose';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import ConnectMongo from 'connect-mongo';

import Users, { UserDocument } from '../domain/models/User';

export const setupAuthenticationMiddleWare = (app: Express, db: Connection): void => {
  const SESSION_SECRET = process.env.SESSION_SECRET as string; // Let it crash if no secret.

  const MongoStore = ConnectMongo(session);

  // configure passport.js to use the local strategy
  passport.use(
    new LocalStrategy({ usernameField: 'userName' }, async (userName, password, done) => {
      const user = await Users.findOne({
        userName,
      }).exec();

      if (user === null) return done(null, false);

      const isPasswordCorrect = await user.validatePassword(password);
      if (!isPasswordCorrect) return done(null, false);

      return done(null, user);
    }),
  );

  // tell passport how to serialize the user
  passport.serializeUser((user: UserDocument, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await Users.findById(id).exec();

    done(null, user);
  });

  app.use(session({
    secret: SESSION_SECRET,
    store: new MongoStore({
      mongooseConnection: db,
    }),
    resave: false,
    saveUninitialized: false,
  }));

  app.use(passport.initialize());
  app.use(passport.session());
};
