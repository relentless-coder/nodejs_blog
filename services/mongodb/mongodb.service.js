import {connectMongo} from "../../config/mongodb.config";

function findAll(collection, query, resClass) {
    let model;
    const queryCollection = (db)=>{
        model  = db;
        let query = query ? query : {};
        let docs = model.collection(collection);
        return docs.find(query).then(data=>data).catch((err)=>{

        })
    };

    const populateResService = (docs)=>{
        let data = [];
        docs.forEach((doc)=>{
            data.push(new resClass(doc))
        });

        return data;
    };

    const sendResponse = (data)=>{
        model.close();
        return {
            data,
            message: 'Documents query successful',
            status: 200
        }
    };

    connectMongo().then(queryCollection).then(populateService).then(sendResponse).catch((err)=>{
        model.close();
        return {
            status: 500,
            message: 'Sorry, we seem to be facing some issue right now. Please try agaiin later.',
            error: err
        }
    })
}

function findOne(collection, query, resClass) {
    let model;
    const queryCollection = (db)=>{
        model  = db;
        let query = query ? query : {};
        let docs = model.collection(collection);
        return docs.findOne(query).then(data=>data).catch((err)=>{

        })
    };

    const populateResService = (docs)=>{
        let data = [];
        docs.forEach((doc)=>{
            data.push(new resClass(doc))
        });

        return data;
    };

    const sendResponse = (data)=>{
        model.close();
        return {
            data,
            message: 'Document query successful',
            status: 200
        }
    };

    connectMongo().then(queryCollection).then(populateService).then(sendResponse).catch((err)=>{
        model.close();
        return {
            status: 500,
            message: 'Sorry, we seem to be facing some issue right now. Please try agaiin later.',
            error: err
        }
    })
}

function insert(collection, query, doc, reqClass, resClass) {
    let model;
    let isArray = false;

    const populateReqService = (db)=>{
        model = db;
        if(Array.isArray(doc)){
            let requestData = [];
            isArray = true;
            doc.forEach((el)=>{
                requestData.push(new reqClass(el))
            });

            return requestData

        } else {
            return new reqClass(doc)
        }
    };

    const insertDocument = (docs)=>{
        let localCollection = model.collection(collection);

        if(isArray){
            return localCollection.insertMany(docs).then(data=>data).catch((err))
        } else {
            return localCollection.insertOne(docs).then(data=>data).catch((err))
        }
    };

    const populateResService = (result)=>{
        if(Array.isArray(result.ops)){
            let data = [];
            result.ops.forEach((el)=>{
                data.push(new resClass(el))
            })

            return data;
        } else {
            return new resClass(result.ops);
        }
    };

    const sendResponse = (data)=>{
        model.close();
        return {
            data,
            message: 'Document inserted successfully',
            status: 200
        }
    };

    connectMongo().then(populateReqService).then(insertDocument).then(populateResService).then(sendResponse).catch((err)=>{
        model.close();
        return {
            status: 500,
            message: 'Sorry, we seem to be facing some issue right now. Please try again later.',
            error: err
        }
    })
}

function update(collection, query, body, resClass) {
    let model;

    const updateDocument = (db)=>{
        model = db;

        let localCollection = model.collection(collection);

        return localCollection.updateOne(query, body).then(data=>data)
    };

    const queryDocument = ()=>{
        let localCollection = model.collection(collection);

        return localCollection.findOne(query).then(data=>data).catch()
    };

    const populateResService = (doc)=>{
        return new resClass(doc)
    };

    const sendResponse = (data)=>{
        model.close();
        return {
            data,
            message: 'Document updated successfully',
            status: 200
        }
    };

    connectMongo().then(updateDocument).then(queryDocument).then(populateResService).then(sendResponse).catch((err)=>{
        return {
            status: 500,
            message: 'Sorry, we seem to be facing some issue right now. Please try again later.',
            error: err
        }
    })
}

export {findAll, findOne, insert, update}