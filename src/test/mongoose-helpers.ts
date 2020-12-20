import mongoose from 'mongoose';

export function connect(): Promise<typeof mongoose> {
  return mongoose.connect('mongodb://localhost:27017/qover-insurance-jest', {
    useNewUrlParser: true,
    autoIndex: true, // make sure the tests are using indexes on the documents
    useCreateIndex: false,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
}

export function disconnect(): Promise<void> {
  return mongoose.disconnect();
}

function dropCollection(collectionName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    mongoose.connection.db.collection(collectionName, { strict: true }, async (err, result) => {
      if (err) return reject(err);

      try {
        await result.deleteMany({});
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });
}

export function dropCollections(...collections: string[]): Promise<void[]> {
  const deletePromises = collections.map((collection) => dropCollection(collection));

  return Promise.all(deletePromises);
}
