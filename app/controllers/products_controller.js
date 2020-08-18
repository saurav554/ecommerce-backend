const express = require("express");
const router = express.Router();
const {Product} = require('../models/product');

//localhost:3000/products/
router.get("/",function(req,res){
    Product.find().
    then(function(products){ 
        res.send(products);
    })
    .catch(function(err){
        res.send(err);
    });
});

//localhost:3000/products/id
router.get("/:id",function(req,res){
    let id = req.params.id;
    Product.findById(id)
    .then(function(product){
        res.send(product);
    }).catch(function(err){
        res.send(err);
    })

});

 // post--localhost:3000/products
 router.post("/",function(req,res){
     let body = req.body;
     let c = new Product(body);
     c.save().then(function(product){
         res.send(product);
     }).catch(function(err){
         res.send(err);
     })
 });

 //delete -- localhost:3000/products/id

 router.delete("/:id",function(req,res){
     let id = req.params.id;
     Product.findByIdAndDelete(id)
     .then(function(product){
         res.send({
             notice: 'Successfully deleted the record'
         })
         .catch(function(err){
             res.send(err);
         });
     })
 })


module.exports = {
    productsController : router
}