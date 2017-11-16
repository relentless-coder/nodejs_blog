import {connectMongo} from "../../config/mongoconfig";
import {ErrorWithStatusCode} from "../../handlers/errorhandler";

function findAll(collection, query, resClass, dummy) {
    let model;
    const queryCollection = (db) => {
        model = db;
        let query = query ? query : {};
        let docs = model.collection(collection);
        return new Promise((resolve, reject)=>{
          docs.find(query).toArray((err, data)=>{
            if(err){
              reject(err)
            } else {
              resolve(data);
            }
          })
        })
    };

    const populateResService = (docs) => {
      console.log(docs);
        console.log('reached populateResService')
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

function findSingle(collection, query, resClass, dummy) {
    if (!collection || !query || !resClass) {
        throw new ErrorWithStatusCode(422, 'Can\'t process request with incomplete data.', 'You haven\'t passed the required params to this function. Kindly, make sure the function is called with all the params mentioned in the document.')
    }
    let model;
    const queryCollection = (db) => {
        model = db;
        let docs = model.collection(collection);
        return new Promise((resolve, reject)=>{
            docs.findOne(query, (err, data)=>{
                if(err){
                    console.log(err);
                    reject(err)
                } else {
                    console.log(data);
                    resolve(data);
                }
            })
        })
    };

    const populateResService = (docs) => {
        console.log(docs);
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
            message: 'Document query successful',
            status: 200
        }
    };

    return connectMongo(dummy).then(queryCollection).then(populateResService).then(sendResponse).catch((err) => {
        model.close();
        return {
            status: 500,
            message: 'Sorry, we seem to be facing some issue right now. Please try again later.',
            error: err
        }
    })
}

function insert(collection, doc, reqClass, resClass, dummy) {
    let model;
    let isArray = false;

    if (!collection || !doc || !reqClass || !resClass) {
        throw new ErrorWithStatusCode(422, 'Can\'t process request with incomplete data.', 'You haven\'t passed the required params to this function. Kindly, make sure the function is called with all the params mentioned in the document.')
    }

    if (Object.keys(doc).length === 0 || (Object.keys(doc).length === 1 && doc._id)) {
        throw new ErrorWithStatusCode(400, 'Inserting empty documents is not allowed.', 'You tried to pass ' +
            'empty document to the database. This will pollute your database. Kindly, try again with at least one' +
            ' value other than _id.')
    }

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
            return new reqClass(doc)
        }
    };

    const insertDocument = (docs) => {
        console.log(docs);
        let localCollection = model.collection(collection);

        return new Promise((resolve, reject)=>{
            localCollection.insertOne(docs, (err, done)=>{
                if(err){
                    console.log(err);
                    reject(err)
                } else {
                    console.log(done)
                    resolve(done);
                }
            })
        })
    };

    const populateResService = (result) => {
        if (Array.isArray(result.ops)) {
            let data = [];
            result.ops.forEach((el) => {
                data.push(new resClass(el))
            });

            return data;
        } else {
            return new resClass(result.ops);
        }
    };

    const sendResponse = (data) => {
        console.log("data is ", data);
        model.close();
        return {
            data,
            message: 'Document inserted successfully',
            status: 200
        }
    };

    return connectMongo(dummy).then(populateReqService).then(insertDocument).then(populateResService).then(sendResponse).catch((err) => {
        model.close();
        return {
            status: 500,
            message: 'Sorry, we seem to be facing some issue right now. Please try again later.',
            error: err
        }
    })
}

function update(collection, query, body,reqClass, resClass, dummy) {
    let model;

    if (!body) {
        return {
            status: 400,
            message: 'Updating with empty object is not allowed.',
            err: 'You were trying to update the existing document with an empty object, ' +
            'it would completely replace your document with empty values.'
        }
    }

    const populateReqService = (db)=>{
      model = db;
      return new reqClass(body)
    };

    const updateDocument = (object) => {

        let localCollection = model.collection(collection);

        return new Promise((resolve, reject)=>{
          localCollection.updateOne(query, object, (err, done)=>{
            if(err){
              reject(err)
            } else {
              resolve(done)
            }
          })
        })
    };

    const queryDocument = () => {
        let localCollection = model.collection(collection);

        return new Promise((resolve, reject)=>{
          localCollection.findOne(query, (err, doc)=>{
            if(err){
              reject(err)
            } else {
              resolve(doc);
            }
          });
        })
    };

    const populateResService = (doc) => {
        console.log("populateResService ", doc);
        return new resClass(doc)
    };

    const sendResponse = (data) => {
      console.log(data);
        model.close();
        return {
            data,
            message: 'Document updated successfully',
            status: 200
        }
    };

    connectMongo(dummy).then(populateReqService).then(updateDocument).then(queryDocument).then(populateResService).then(sendResponse).catch((err) => {
      model.close();
      console.log('mongodb service', err);
      return {
            status: 500,
            message: 'Sorry, we seem to be facing some issue right now. Please try again later.',
            error: err
        }
    })
}

export {findAll, findSingle, insert, update}
