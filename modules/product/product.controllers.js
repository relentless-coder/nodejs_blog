import {findAll, findOne, insert, update} from "../../services/mongodb/mongodb.service";
import {getProduct, addProduct, updateProduct} from "../../services/layers/product.layer";
import {upload} from "../../../config/multer.config";
import {ErrorWithStatusCode} from "../../../handlers/error.handler";

const fileUpload = upload.array('gallery')

export function getAllProducts(req, res){
    findAll('products', {}, getProduct).then((data) => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({data}))
    })
}

export function getOneProduct(req, res){
    let query = {
        _id: req.params.productId
    };
    findOne('productions', query, getProduct).then((data) => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({data}))
    })
}

export function addOneProduct(req, res){

    const getData = () => {
        let body = [];
        return new Promise((resolve, reject) => {
            req.on('error', (err) => {
                reject(err);
            }).on('data', (stream) => {
                body.push(stream);
            }).on('end', () => {
                let data = Buffer.concat(body).toString();
                resolve(data);
            })
        })
    };

    const addToDatabase = (data) => {
        req.body = data;
        fileUpload(req, res, (err) => {
            if (err) {
                throw new ErrorWithStatusCode(500, 'Sorry, we seem to be facing some issue right now. Please, try again later.', err);
            } else {
                let files = [];
                if (req.files) {
                    req.files.forEach((file) => {
                        files.push(file.path);
                    })
                    req.body = files;
                }

                insert('products', req.body, addProduct, getProduct).then((data) => {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end(JSON.stringify({data}))
                }).catch((err) => {
                    throw new ErrorWithStatusCode(500, 'Sorry, we seem to be facing some issue right now. Please try again later.', err);
                })

            }
        })
    };

    getData().then(addToDatabase).catch((err) => {
        if (err.code && err.message) {
            res.writeHead(err.code, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: err.message, error: err.error}))
        } else {
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                message: 'Sorry, we seem to be facing some issue right now. Please, try again later.',
                error: err
            }))
        }
    })
}
