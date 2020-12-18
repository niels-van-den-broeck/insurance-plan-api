import mongoose from 'mongoose';
import session from 'express-session';
import ConnectMongo from 'connect-mongo';

import app from './app';

const MongoStore = ConnectMongo(session);

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/qover-insurance';
const SESSION_SECRET = process.env.SESSION_SECRET as string; // Let it crash if no secret.

const db = mongoose.connection;
db.on('error', () => {
  console.error('Connection to the database failed');
  process.exit(0);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
  app.use(session({
    secret: SESSION_SECRET,
    store: new MongoStore({ mongooseConnection: db }),
    resave: false,
    saveUninitialized: false,
  }));

  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
});

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
