import mongoose from 'mongoose';

import buildApp from './app';

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/qover-insurance';

const db = mongoose.connection;

db.on('error', () => {
  console.error('Connection to the database failed');
  process.exit(0);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
  const app = buildApp();

  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
});

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
