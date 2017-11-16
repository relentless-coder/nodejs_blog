import {findAll, findSingle, insert, update} from "../../services/mongodb/mongodb.service";
import {getProduct, addProduct, updateProduct} from "../../services/layers/product.layer";
import {upload} from "../../config/multerconfig";
import {ErrorWithStatusCode} from "../../handlers/errorhandler";

const fileUpload = upload.array('gallery')

export function getAllProducts(req, res) {
    findAll('products', {}, getProduct).then((data) => {
        console.log(data);
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({data}))
    }).catch((err) => {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({data}))
    })
}

export function getOneProduct(req, res) {
    let query = {
        _id: req.params.productId
    };
    findSingle('productions', query, getProduct).then((data) => {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({data}))
    })
}

export function addOneProduct(req, res) {

    const getData = () => {
        return new Promise((resolve, reject) => {
            fileUpload(req, res, (err) => {
                if (err) {
                    reject(err)
                } else {
                    let files = [];
                    if (req.files) {
                        req.files.forEach((file) => {
                            files.push(file.path);
                        });
                        req.body.gallery = files;
                    }

                    resolve(req)

                }
            })
        })

    };

    const addToDatabase = () => {
        return insert('products', req.body, addProduct, getProduct).then((data) => {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(data))
        }).catch((err) => {
            throw new ErrorWithStatusCode(500, 'Sorry, we seem to be facing some issue right now. Please try again later.', err);
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
