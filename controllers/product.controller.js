const { check, validationResult } = require('express-validator');
const slug = require('slug');
const db = require('../models/index');
const Product = db.products;
const User = db.users;
const Category = db.categories;
const Attribute = db.attributes;
const Library = db.library;
const Sequelize = db.Sequelize;
const Op = Sequelize.Op;
exports.create = async (req,res) => {
    try {
        await check("name")
            .notEmpty().withMessage("Tên sản phẩm không được để trống")
            .run(req);
        await check("categories")
            .notEmpty().withMessage("Bạn chưa chọn chuyên mục")
            .run(req);
        validationResult(req).throw();
        const data = {
            name: req.body.name,
            sku: req.body.sku || '',
            description: req.body.description || '',
            details: req.body.details || '',
            thumbnail: req.body.thumbnail || null,
            quantity: req.body.quantity || 0,
            regular_price: req.body.regular_price || 0,
            sale_price: req.body.sale_price || 0,
            sale_start_time: req.body.sale_start_time,
            sale_end_time: req.body.sale_start_time,
            status: req.body.status || 'draft',
            post_date: req.body.post_date,
            user_id: req.user_id,
        }
        const newProduct = await Product.create(data);
        const productSlug = slug(data.name);
        Product.update({
            slug: `${productSlug}-${newProduct.id}`
        }, {where: {id: newProduct.id}});
        newProduct.slug = `${productSlug}-${newProduct.id}`;
        await newProduct.addCategories(req.body.categories || []);
        await newProduct.addAttributes(req.body.attributes || []);
        await newProduct.addImages(req.body.images || []);
        return res.status(200).json(newProduct);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}
exports.getProductByQuery = async(req,res) => {
    try {
        const category = req.query.category || null;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10; 
        const page = req.query.page ? parseInt(req.query.page) : 1; 
        if(page <= 0) throw "Lỗi";
        const name = req.query.name || ''; 
        const status = req.query.status || 'public'; 
        let include = [];
        include = [
            {model: User},
            {model: Library, as: "thumb"},
            {model: Category},
        ]
        if(category) include[2].where = {id: parseInt(category)}
        let query = {
            order: [['id', 'DESC']],
            where: {
                name: {
                    [Op.substring]: name
                },
                status: status
            },
            offset: limit*(page-1),
            limit: limit,
            include: include
        };
        const {count,rows} = await Product.findAndCountAll(query);
        return res.status(200).json({count,rows});
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}
exports.getAll = async(req,res) => {
    try {
        const allProduct = await Product.findAll({
            include: [
                {model: Attribute},
                {model: Library, as: "images"},
                {model: Library, as: "thumb"},
                {model: Category},
            ]
        });
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
            .custom((value) => Product.findOne({
                where: {id: value},
                include: [
                    {model: Attribute},
                    {model: Library, as: "images"},
                    {model: Library, as: "thumb"},
                    {model: Category},
                ]
            })
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
        await check("categories")
            .notEmpty().withMessage("Bạn chưa chọn chuyên mục")
            .run(req);
        validationResult(req).throw();
        const productSlug = await slug(req.body.name);
        const data = {
            name: req.body.name,
            sku: req.body.sku || '',
            description: req.body.description || '',
            details: req.body.details || '',
            thumbnail: req.body.thumbnail || null,
            quantity: req.body.quantity || 0,
            regular_price: req.body.regular_price || 0,
            sale_price: req.body.sale_price || 0,
            sale_start_time: req.body.sale_start_time,
            sale_end_time: req.body.sale_start_time,
            status: req.body.status || 'draft',
            post_date: req.body.post_date,
            user_id: req.user_id,
            slug: productSlug,
        }
        const isUpdate = await Product.update(data, {where: {id: req.params.id}});
        await product.setCategories(req.body.categories || []);
        await product.setAttributes(req.body.attributes || []);
        await product.setImages(req.body.images || []);
        return res.status(200).json({isUpdate: isUpdate ? true : false});
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

exports.autosave = async(req,res) => {
    try {
        let product = {};
        await check("id")
            .custom((value) => Product.findOne({where: {id: value}})
                                .then((res) => {
                                product = res;
                                    if(!res) return Promise.reject("Lỗi! Mục này không tồn tại.")
                                })
            )
            .run(req);
        validationResult(req).throw();
        const isUpdate = await Product.update({
            details: req.body.details
        }, {where: {id: req.params.id}});
        return res.status(200).json({isUpdate: isUpdate ? true : false});
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

exports.trash = async(req,res) => {
    try {
        let product = {};
        await check("id")
            .custom((value) => Product.findOne({where: {id: value}})
                                .then((res) => {
                                    product = res;
                                    if(!res) return Promise.reject("Lỗi! Mục này không tồn tại.")
                                })
            )
            .run(req);
        validationResult(req).throw();
        const isUpdate = await Product.update({
            status: 'trash'
        }, {where: {id: req.params.id}});
        console.log(isUpdate)
        return res.status(200).json({isUpdate: isUpdate ? true : false});
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}
exports.restore = async(req,res) => {
    try {
        let product = {};
        await check("id")
            .custom((value) => Product.findOne({where: {id: value}})
                                .then((res) => {
                                    product = res;
                                    if(!res) return Promise.reject("Lỗi! Mục này không tồn tại.")
                                })
            )
            .run(req);
        validationResult(req).throw();
        const isUpdate = await Product.update({
            status: 'public'
        }, {where: {id: req.params.id}});
        console.log(isUpdate)
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
                                    if(!res) return Promise.reject("Lỗi! Mục này không tồn tại.")
                                })
            )
            .run(req);
        validationResult(req).throw();
        await product.setCategories([]);
        await product.setAttributes([]);
        await product.setImages([]);
        const isDestroy = await Product.destroy({where: {id: req.params.id}});
        console.log(isDestroy)
        return res.status(200).json({isDestroy: isDestroy ? true : false});
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
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