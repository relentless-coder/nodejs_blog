import mongodb from 'mongodb';

const url = 'mongodb://localhost:27017/wingify-project';

const client = mongodb.MongoClient;

const connectMongo = (dummy) => {
  if (dummy) return Promise.resolve(dummy);
  return new Promise((resolve, reject) => {
    client.connect(url, (err, db) => {
      if (err) {
        reject(err)
      } else {
        resolve(db)
      }
    })
  })
};

export {connectMongo}