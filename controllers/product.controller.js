const { check, validationResult } = require('express-validator');
const slug = require('slug');
const db = require('../models/index');
const Product = db.products;
const Category = db.categories;
exports.create = async (req,res) => {
    try {
        await check("name")
            .notEmpty().withMessage("Tên sản phẩm không được để trống")
            .run(req);
        validationResult(req).throw();
        const data = {
            name: req.body.name,
            code: req.body.code || '',
            description: req.body.description || '',
            details: req.body.details || '',
            quantily: req.body.quantily || 0,
            regular_price: req.body.regular_price || 0,
            sale_price: req.body.sale_price || 0,
            status: req.body.status || 'pending',
        }
        const newProduct = await Product.create(data);
        const productSlug = await slug(data.name);
        Product.update({
            slug: `${productSlug}-${newProduct.id}`
        }, {where: {id: newProduct.id}});
        newProduct.slug = `${productSlug}-${newProduct.id}`;
        const categories = await Category.findAll({where: {category_type: 'product'}});
        let requestCategories = req.body.categories || [];
        requestCategories = await requestCategories.filter((value1) => categories.find((value2) => parseInt(value1) === value2.id));
        const results = await newProduct.addCategories(requestCategories);
        console.log(results);
        return res.status(200).json(newProduct);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}
exports.getAll = async(req,res) => {
    try {
        const allProduct = await Product.findAll();
        return res.status(200).json(allProduct);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

exports.getById = async(req,res) => {
    try {
        console.log(req.params.id);
        let product = {};
        await check("id")
            .custom((value) => Product.findOne({where: {id: value}})
                                .then((res) => {
                                    product = res;
                                    if(!res) return Promise.reject("Lỗi! Sản phẩm không tồn tại.")
                                })
            )
            .run(req);
        validationResult(req).throw();
        console.log(product)
        return res.status(200).json(product);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}
exports.edit = async (req,res) => {
    try {
        let product = {};
        await check("id")
            .custom((value) => Product.findOne({where: {id: value}})
                .then((res) => {
                    product = res;
                    if(!res) return Promise.reject("Lỗi! Sản phẩm không tồn tại.")
                })
            )
            .run(req);
        await check("name")
            .notEmpty().withMessage("Tên sản phẩm không được để trống")
            .run(req);
        validationResult(req).throw();
        const productSlug = await slug(req.body.name);
        const data = {
            name: req.body.name,
            code: req.body.code || '',
            description: req.body.description || '',
            details: req.body.details || '',
            quantily: req.body.quantily || 0,
            regular_price: req.body.regular_price || 0,
            sale_price: req.body.sale_price || 0,
            slug: `${productSlug}-${req.params.id}`,
            status: req.body.status || 'pending',
        }
        const isUpdate = await Product.update(data, {where: {id: req.params.id}});
        const categories = await Category.findAll();
        let requestCategories = req.body.categories || [];
        requestCategories = await requestCategories.filter((value1) => categories.find((value2) => parseInt(value1) === value2.id));
        const results = await product.setCategories(requestCategories);
        return res.status(200).json({isUpdate: isUpdate ? true : false});
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}
exports.destroy = async(req,res) => {
    try {
        let product = {};
        await check("id")
            .custom((value) => Product.findOne({where: {id: value}})
                                .then((res) => {
                                    product = res;
                                    if(!res) return Promise.reject("Lỗi! Sản phẩm không tồn tại.")
                                })
            )
            .run(req);
        validationResult(req).throw();
        await product.setCategories([]);
        const isDestroy = await Product.destroy({where: {id: req.params.id}});
        console.log(isDestroy)
        return res.status(200).json({isDestroy: isDestroy ? true : false});
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}
exports.getProductByCategory = async (req,res) => {
    try {
        const product = await Product.findOne({where: {id: req.params.id}});
        const allProducts = await product.getCategories();
        console.log(allProducts);
        return res.status(200).json(allProducts);
    } catch (error) { 
        return res.status(400).json(error);
    }
}