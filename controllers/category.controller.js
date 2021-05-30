const { check, validationResult } = require("express-validator");
const slug = require('slug');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require("../models/index");
const Category = db.categories;
exports.create = async(req,res) => {
    try {
        const categoryType = req.query.category_type || 'post';
        req.body.parent_id = req.body.parent_id ? parseInt(req.body.parent_id) : 0;
        await check("name")
            .notEmpty().withMessage("Tên chuyên mục không được để trống")
            .run(req);
        await check("parent_id")
            .custom(async (value) => {
                const val = parseInt(value);
                if (val >= 1) {
                    const result = await Category.findByPk(val);
                    if (result === null) return Promise.reject("Không tồn tại chuyên mục cha");
                } else if (val < 0) Promise.reject("Không tồn tại chuyên mục cha");
            })
            .run(req);
        validationResult(req).throw();
        const data = {
            ...req.body,
            category_type: categoryType
        }
        let newCategory = await Category.create(data);
        const categorySlug = await slug(req.body.name);
        Category.update({
            slug: `${categorySlug}-${newCategory.id}`
        }, {where: {id: newCategory.id}});
        newCategory.slug = `${categorySlug}-${newCategory.id}`
        return res.status(200).json(newCategory);
    } catch (error) {
        res.status(400).json(error);
    }
}
exports.getCategoryByQuery = async(req,res) => {
    try {
        const category_type = req.query.category_type || null; 
        const limit = req.query.limit ? parseInt(req.query.limit) : 10; 
        const page = req.query.page ? parseInt(req.query.page) : 1; 
        const name = req.query.name || ''; 
        const parent_id = req.query.parent_id ? parseInt(req.query.parent_id) : 0; 

        let query = {
            order: [['id', 'DESC']],
            where: {
                name: {
                    [Op.substring]: name
                },
                parent_id: parent_id
            },
            offset: limit*(page-1),
            limit: limit
        };
        if (category_type !== null) {
            query.where.category_type = category_type;
        }
        const { count, rows }= await Category.findAndCountAll(query);
        return res.status(200).json({ count, rows });
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}
exports.getById = async(req,res) => {
    try {
        console.log(req.params.id);
        let category = {};
        await check("id")
            .custom((value) => Category.findOne({where: {id: value}})
                                .then((res) => {
                                    category = res;
                                    if(!res) return Promise.reject("Lỗi! Chuyên mục không tồn tại.")
                                })
            )
            .run(req);
        validationResult(req).throw();
        console.log(category)
        return res.status(200).json(category);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

exports.edit = async(req,res) => {
    try {
        console.log(req.params.id);
        await check("id")
            .custom((value) => Category.findOne({where: {id: value}})
                                .then((res) => {
                                    if(!res) return Promise.reject("Lỗi! Chuyên mục không tồn tại.")
                                })
            )
            .run(req);
        await check("name")
            .notEmpty().withMessage("Tên chuyên mục không được để trống")
            .run(req);

        validationResult(req).throw();
        req.body.parent_id = req.body.parent_id || 0;
        const categorySlug = await slug(req.body.name);
        const data = {
            ...req.body,
            slug: `${categorySlug}-${req.params.id}`
        }
        const isUpdate = Category.update(data, {where: {id: req.params.id}});
        return res.status(200).json({isUpdate: isUpdate ? true : false});
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}
exports.destroy = async(req,res) => {
    try {
        console.log(req.params.id);
        await check("id")
            .custom((value) => Category.findOne({where: {id: value}})
                                .then((res) => {
                                    if(!res) return Promise.reject("Lỗi! Chuyên mục không tồn tại.")
                                })
            )
            .run(req);
        validationResult(req).throw();
        const isDestroy = await Category.destroy({where: {id: req.params.id}});
        console.log(isDestroy)
        return res.status(200).json({isDestroy: isDestroy ? true : false});
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}
