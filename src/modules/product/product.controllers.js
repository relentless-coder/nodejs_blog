import {findAll, findOne, insert, update} from "../../services/mongodb/mongodb.service";
import {getProduct, addProduct, updateProduct} from "../../services/layers/product.layer";

export default getAllProducts(req, res){
    findAll('products', {}, getProduct).then((data)=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({data}))
    })
}

export default getOneProduct(req, res){
    let query = {
      _id: req.params.productId
    };
    findOne('productions', query, getProduct).then((data)=>{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({data}))
    })
}
