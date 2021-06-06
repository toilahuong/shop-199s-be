const { check, validationResult } = require("express-validator");
const slug = require('slug');
const db = require("../models/index");
const Category = db.categories;
const Library = db.library;
const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

exports.create = async (req, res) => {
    try {
        req.body.category_type = req.body.category_type === "product" ? req.body.category_type : "post";
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
            ...req.body
        }
        let newCategory = await Category.create(data);
        const categorySlug = await slug(req.body.name);
        Category.update({
            slug: `${categorySlug}-${newCategory.id}`
        }, { where: { id: newCategory.id } });
        newCategory.slug = `${categorySlug}-${newCategory.id}`
        return res.status(200).json(newCategory);
    } catch (error) {
        return res.status(400).json(error);
    }
}
exports.getCategoryByQuery = async (req, res) => {
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
            offset: limit * (page - 1),
            limit: limit
        };
        if (category_type !== null) {
            query.where.category_type = category_type;
        }
        const { count, rows } = await Category.findAndCountAll(query);
        return res.status(200).json({ count, rows });
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}
exports.getAll = async (req, res) => {
    try {
        const category_type = req.query.category_type || null;
        const name = req.query.name || '';
        const parent_id = req.query.parent_id ? parseInt(req.query.parent_id) : null;
        let query = {
            order: [['id', 'DESC']],
            where: {
                name: {
                    [Op.substring]: name
                }
            }
        };
        if (parent_id !== null) {
            query.where.parent_id = parent_id;
        }
        if (category_type !== null) {
            query.where.category_type = category_type;
        }
        const { count, rows } = await Category.findAndCountAll(query);
        return res.status(200).json({ count, rows });
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}
exports.getTreeCategory = async (req, res) => {
    try {
        const category_type = req.query.category_type || null;

        let query = {
            order: [['id', 'DESC']],
            where: {
                parent_id: 0
            },
            include: [
                {model: Library}
            ],
            raw: true,
        };
        if (category_type !== null) {
            query.where.category_type = category_type;
        }
        const response = await Category.findAll(query);
        const result = await treeCategory(response);
        console.table(result);
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

exports.getById = async (req, res) => {
    try {
        console.log(req.params.id);
        let category = {};
        await check("id")
            .custom((value) => Category.findOne({ where: { id: value }, include: [{model: Library}] })
                .then((res) => {
                    category = res;
                    if (!res) return Promise.reject("Lỗi! Chuyên mục không tồn tại.")
                })
            )
            .run(req);
        validationResult(req).throw();
        console.log(category)
        return res.status(200).json(category);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

exports.edit = async (req, res) => {
    try {
        console.log(req.params.id);
        await check("id")
            .custom((value) => Category.findOne({ where: { id: value } })
                .then((res) => {
                    if (!res) return Promise.reject("Lỗi! Chuyên mục không tồn tại.")
                })
            )
            .run(req);
        await check("name")
            .notEmpty().withMessage("Tên chuyên mục không được để trống")
            .run(req);

        validationResult(req).throw();
        req.body.parent_id = req.body.parent_id || 0;
        const categorySlug = slug(req.body.name);
        const data = {
            ...req.body,
            slug: `${categorySlug}-${req.params.id}`
        }
        const isUpdate = await Category.update(data, { where: { id: req.params.id } });
        return res.status(200).json({ isUpdate: isUpdate ? true : false });
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}
exports.destroy = async (req, res) => {
    try {
        let data = []
        await check("id")
            .custom((value) => Category.findOne({ where: { id: value } })
                .then((res) => {
                    data = res;
                    if (!res) return Promise.reject("Lỗi! Chuyên mục không tồn tại.")
                    if(res.default) return Promise.reject("Lỗi! Không thể xóa chuyên mục mặc định.")
                })
            )
            .run(req);
        validationResult(req).throw();
        let response;
        if(data.category_type === "post") response = await data.getPosts({raw: true});
        else  response = await data.getProducts({raw: true});
        const ids = response.map(res => res.id);
        const defaultCategory = await Category.findOne({where: {default: true, category_type: data.category_type}});
        await defaultCategory.addPosts(ids);
        await data.setPosts([]);
        const isDestroy = await Category.destroy({ where: { id: req.params.id } });
        console.log(isDestroy)
        return res.status(200).json({ isDestroy: isDestroy ? true : false });
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

exports.setDefault = async (req, res) => {
    try {
        console.log(req.params.id);
        await check("id")
            .custom((value) => Category.findOne({ where: { id: value} })
                .then((res) => {
                    if (!res) return Promise.reject("Lỗi! Chuyên mục không tồn tại.")
                })
            )
            .run(req);

        validationResult(req).throw();
        console.log(req.params.id);
        await Category.update({default: false}, {where: {category_type: req.params.category_type, default: true}});
        const isUpdate = await Category.update({default: true}, { where: { id: req.params.id } });
        return res.status(200).json({ isUpdate: isUpdate ? true : false });
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}
const treeCategory = async (categories) => {
    const result = await Promise.all(categories.map(async (item) => {
        let query = {
            order: [['id', 'DESC']],
            where: {
                parent_id: item.id
            },
            raw: true,
        };
        const response = await Category.findAll(query);
        if (response.length > 0) {
            const res = await treeCategory(response);
            item = {
                ...item,
                childrens: res
            }
        }
        return item;
    }));
    return result;
}
exports.getPostByCategory = async (req, res) => {
    try {
        let data;
        await check("id")
            .notEmpty("Chuyên mục không tồn tại")
            .custom((value) => Promise((resolve, reject) => {
                Category.findOne({ where: { id: parseInt(value) } })
                    .then((res) => {
                        if (res) {
                            data = res;
                        } else {
                            reject("Chuyên mục không tồn tại")
                        }
                    }).catch((error) => reject("Chuyên mục không tồn tại"))
            }))
        validationResult(req).throw();
        const response = await data.getPosts();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}