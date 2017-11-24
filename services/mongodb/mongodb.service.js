import {connectMongo} from "../../config/mongo.config";
import {ErrorWithStatusCode} from "../../handlers/errorhandler";

function findAll(collection, query, resClass, dummy) {
  let model;
  const queryCollection = (db) => {
    model = db;
    let query = query ? query : {};
    let docs = model.collection(collection);
    return new Promise((resolve, reject) => {
      docs.find(query).toArray((err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data);
        }
      })
    })
  };

  const populateResService = (docs) => {
    let data = [];
    docs.forEach((doc) => {
      data.push(new resClass(doc))
    });
    return data;
  };

  const sendResponse = (data) => {
    model.close();
    return {
      data,
      message: 'Documents query successful',
      status: 200
    }
  };

  return connectMongo(dummy).then(queryCollection).then(populateResService).then(sendResponse).catch((err) => {
    model.close();
    throw new ErrorWithStatusCode(500, 'Sorry, we seem to be facing some issue right now. Please, try again later.', err);
  })
}

function findSingle(collection, query, resClass,  body={}, dummy) {
  if (!collection || !query) {
    throw new ErrorWithStatusCode(422, 'Can\'t process request with incomplete data.', 'You haven\'t passed the required params to this function. Kindly, make sure the function is called with all the params mentioned in the document.')
  }
  let model;
  const queryCollection = (db) => {
    model = db;
    let docs = model.collection(collection);
    return new Promise((resolve, reject) => {
      docs.findOne(query, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data);
        }
      })
    })
  };

  const populateResService = (docs) => {
    if(docs){
      if(body.userPassword){
        docs.userPassword = body.userPassword;
      }
      return new resClass(docs);
    } else {
      return {}
    }
  };

  const sendResponse = (localData) => {
    model.close();
    let data = localData ? localData : {};
    return {
      data,
      message: 'Document query successful',
      status: 200
    }
  };

  return connectMongo(dummy).then(queryCollection).then(populateResService).then(sendResponse).catch((err) => {
    model.close();
    throw new ErrorWithStatusCode(err.code, err.message, err.error)
  })
}

function insert(collection, doc, reqClass, resClass, dummy) {
  let model;
  let isArray = false;

  const populateReqService = (db) => {
    model = db;
    if (Array.isArray(doc)) {
      let requestData = [];
      isArray = true;
      doc.forEach((el) => {
        requestData.push(new reqClass(el))
      });

      return requestData

    } else {

      let parseData = new reqClass(doc);

      if(parseData.error){
        throw new ErrorWithStatusCode(parseData.code, parseData.message, parseData.error);
      } else {
        return parseData
      }
    }
  };

  const insertDocument = (docs) => {
    let localCollection = model.collection(collection);
    return new Promise((resolve, reject) => {
      localCollection.insertOne(docs, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data);
        }
      })
    })
  };

  const populateResService = (result) => {
    return new resClass(result.ops[0]);
  };

  const sendResponse = (data) => {
    model.close();
    return {
      data,
      message: 'Document inserted successfully',
      status: 200
    }
  };

  if (!collection || !doc || !reqClass || !resClass) {
    throw new ErrorWithStatusCode(422, 'Can\'t process request with incomplete data.', 'You haven\'t passed the required params to this function. Kindly, make sure the function is called with all the params mentioned in the document.')
  } else if (Object.keys(doc).length === 0 || (Object.keys(doc).length === 1 && doc._id)) {
    throw new ErrorWithStatusCode(400, 'Inserting empty documents is not allowed.', 'You tried to pass ' +
      'empty document to the database. This will pollute your database. Kindly, try again with at least one' +
      ' value other than _id.')
  } else {
    return connectMongo(dummy).then(populateReqService).then(insertDocument).then(populateResService).then(sendResponse).catch((err) => {
      model.close();

      if(err.error){
        throw new ErrorWithStatusCode(err.code, err.message, err.error)
      } else {
        throw new ErrorWithStatusCode(500, 'Sorry, we are facing some issue right now. Please try again later.', err);
      }

    })
  }
}

function update(collection, query, body, reqClass, resClass, dummy) {

  let model;


  if (!body) {
    throw new ErrorWithStatusCode(400, 'Updating with empty object is not allowed.', 'You were trying to update the existing document with an empty object, it would completely replace your document with empty values.');
    }

  const populateReqService = (db) => {
    model = db;
    return new reqClass(body)
  };

  const updateDocument = (object) => {

    let localCollection = model.collection(collection);

    return new Promise((resolve, reject) => {
      localCollection.updateOne(query, object, (err, done) => {
        if (err) {
          reject(err)
        } else {
          resolve(done)
        }
      })
    })
  };

  const queryDocument = () => {
    let localCollection = model.collection(collection);

    return new Promise((resolve, reject) => {
      localCollection.findOne(query, (err, doc) => {
        if (err) {
          reject(err)
        } else {
          resolve(doc);
        }
      });
    })
  };

  const populateResService = (doc) => {
    return new resClass(doc)
  };

  const sendResponse = (data) => {
    model.close();
    return {
      data,
      message: 'Document updated successfully',
      status: 200
    }
  };

  return connectMongo(dummy).then(populateReqService).then(updateDocument).then(queryDocument).then(populateResService).then(sendResponse).catch((err) => {
    model.close();
    if(err.error){
      throw new ErrorWithStatusCode(err.code, err.message, err.error)

    } else {
      throw new ErrorWithStatusCode(500, 'Sorry, we seem to be facing some issue right now. Please try again later.', err);
    }
  });
}

function removeOne(collection, query, dummy) {
  let model;

  const removeDocument = (db) => {
    model = db;
    let docs = model.collection(collection);

    return new Promise((resolve, reject) => {
      docs.removeOne(query, (err, done) => {
        if (err) {
          reject(err);
        } else {
          resolve(done);
        }
      })
    })
  };

  const sendResponse = () => {
    model.close();
    return {
      status: 200,
      message: 'Product deleted successfully'
    }
  };


  return connectMongo(dummy).then(removeDocument).then(sendResponse).catch((err) => {
    model.close();
    throw new ErrorWithStatusCode(500, 'Sorry, we are facing some issue right now. Please, try again later.', err);
  })
}

export {findAll, findSingle, insert, update, removeOne}
