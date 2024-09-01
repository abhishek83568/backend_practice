const express=require('express');
const dotenv=require('dotenv').config();
const ProductModel=require('../Models/product.model');
const Auth = require('../Middlewares/Auth.middleware');
const Authorize = require('../Middlewares/Authorize.middleware');

const productRouter=express.Router();

productRouter.post('/create-product',Authorize(["USER"]),async(req,res)=>{
    try {
        const {title,category,price}=req.body;
        const userId=req.user._id;

        const product=new ProductModel({
            title,price,category,userId
        })

        await product.save();
        res.status(201).json({
            message:"Product added successfully",product
        })

        
    } catch (error) {
        res.status(404).send(`Error while adding ${error}`)
    }
})

productRouter.get('/get-Allproduct',Authorize(["ADMIN"]),async(req,res)=>{
    try {
        const products=await ProductModel.find();

        res.status(200).json({
            message:"All products retrieved",products
        })
    } catch (error) {
    res.status(404).send(`Error while retriving by admin ${error}`)
    }
})


productRouter.get('/get-product',Authorize(["USER"]),async(req,res)=>{
    try {
        const userId=req.user._id
        const {page=1,limit=5,category,sortBy='createdAt',order='desc'}=req.query;

        const filter={userId};

        if(category){
            filter.category=category
        }
          
        const pageNumber=parseInt(page);
        const limitNumber=parseInt(limit);
        const skipNumber=(pageNumber-1)*limitNumber

        let query=ProductModel.find(filter).skip(skipNumber).limit(limitNumber).sort({[sortBy]:order==='asc'?1:-1})
        const products= await query;
        const totalProducts= await ProductModel.countDocuments(filter)
        const totalPages=Math.ceil(totalProducts/limitNumber)
        res.status(200).json({
            message:"User's own product retrieved", products,totalProducts,
            totalPages,
            currentPage: pageNumber,
        })
        
    } catch (error) {
        res.status(404).send(`error ${error}`)
    }
})

productRouter.patch('/update-product/:id',Authorize(["USER"]),async(req,res)=>{
    try {
        const productId=req.params.id;
        const userId=req.user._id;
        const payload=req.body;
       console.log(productId)
        const product=await ProductModel.findById(productId)
        console.log(product)
        if(!product){
            return res.status(404).send(`No product found`)
        }

        if(product.userId.toString()===userId.toString()){
            const updatedProduct=await ProductModel.findByIdAndUpdate(productId,payload)
            res.status(203).json({
                message:"Product updated successfully",
                updatedProduct
            })
        }
    } catch (error) {
        res.status(404).send(`Error while updating product ${error}`)
    }
})

productRouter.delete('/delete-product/:id',Authorize(["USER"]),async(req,res)=>{
    try {
        const productId=req.params.id;
        const userId=req.user._id;
        
       
        const product=await ProductModel.findById(productId)
       
        if(!product){
            return res.status(404).send(`No product found`)
        }

        if(product.userId.toString()===userId.toString()){
            const deletedProduct=await ProductModel.findByIdAndDelete(productId)
            res.status(203).json({
                message:"Product deleted successfully",
              
            })
        }
    } catch (error) {
        res.status(404).send(`Error while deleting product ${error}`)
    }
})

module.exports=productRouter