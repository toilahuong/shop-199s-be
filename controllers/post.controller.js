const { check, validationResult } = require('express-validator');
const slug = require('slug');
const db = require('../models/index');
const Post = db.posts;
const Category = db.categories;
const User = db.users;
const Library = db.library;
const Sequelize = db.Sequelize;
const Op = Sequelize.Op;
exports.create = async (req,res) => {
    try {
        const post_type = req.body.post_type || 'post';

        await check("title")
            .notEmpty().withMessage("Không được để trống tên")
            .run(req);
        
        if(post_type === "post") {
            await check("categories")
                .notEmpty().withMessage("Bạn chưa chọn chuyên mục")
                .run(req);
        }
        validationResult(req).throw();
        const status = req.body.status || 'draft';
        const data = {
            title: req.body.title,
            content: req.body.content,
            thumbnail: req.body.thumbnail,
            post_type: post_type,
            status: status,
            post_date: req.body.postDate,
            user_id: req.user_id
        }
        const newPost = await Post.create(data);
        const postSlug = await slug(data.title);
        Post.update({
            slug: `${postSlug}-${newPost.id}`
        }, {where: {id: newPost.id}});
        newPost.slug = `${postSlug}-${newPost.id}`;
        if(post_type === 'post') {
            const categories = await Category.findAll({where: {category_type: 'post'}});
            let requestCategories = req.body.categories || [];
            requestCategories = await requestCategories.filter((value1) => categories.find((value2) => parseInt(value1) === value2.id));
            const results = await newPost.addCategories(requestCategories);
            console.log(results);
        }
        
        return res.status(200).json(newPost);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}
exports.getPostByQuery = async(req,res) => {
    try {
        const post_type = req.query.post_type || "post";
        const category = req.query.category || null;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10; 
        const page = req.query.page ? parseInt(req.query.page) : 1; 
        if(page <= 0) throw "Lỗi";
        const title = req.query.title || ''; 
        const status = req.query.status || 'public'; 
        let include = [];
        if(post_type === "post") {
            include = [
                {model: User},
                {model: Library},
                {
                    model: Category,
                    where: {}
                },
            ]
            if(category) include[2].where.id = parseInt(category);
        }   
        else 
            include = [
                {model: User},
                {model: Library},
            ]
        let query = {
            order: [['id', 'DESC']],
            where: {
                title: {
                    [Op.substring]: title
                },
                post_type: post_type,
                status: status
            },
            offset: limit*(page-1),
            limit: limit,
            include: include
        };
        const {count,rows} = await Post.findAndCountAll(query);
        return res.status(200).json({count,rows});
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}
exports.getAll = async(req,res) => {
    try {
        const post_type = req.query.post_type || 'post';
        const allPost = await Post.findAll({where: {post_type: post_type}});
        return res.status(200).json(allPost);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}

exports.getById = async(req,res) => {
    try {
        let post = {};
        console.log(req.params.post_type)
        const post_type = req.params.post_type || 'post';
        await check("id")
            .custom((value) => Post.findOne({where: {id: value, post_type: post_type}, include: [{model: Library}]})
                                .then((res) => {
                                    post = res;
                                    if(!res) return Promise.reject("Lỗi! Mục này không tồn tại.")
                                })
            )
            .run(req);
        validationResult(req).throw();
        const postt = post.get({plain: true})
        if (post_type === "post") {
            const categories = await post.getCategories({raw:true})
            return res.status(200).json({...postt,categories});
        } else {
            return res.status(200).json({...postt});
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}
exports.edit = async (req,res) => {
    try {
        let post = {};
        const post_type = req.body.post_type || 'post';
        await check("id")
            .custom((value) => Post.findOne({where: {id: value,post_type: post_type}})
                .then((res) => {
                    post = res;
                    if(!res) return Promise.reject("Lỗi! Mục này này không tồn tại.")
                })
            )
            .run(req);
        await check("title")
            .notEmpty().withMessage("Không được để trống tên")
            .run(req);
        if(post_type === "post") {
            await check("categories")
                .notEmpty().withMessage("Bạn chưa chọn chuyên mục")
                .run(req);
        }
        
        validationResult(req).throw();
        const status = req.body.status || 'draft';
        const postSlug = await slug(req.body.title);
        const data = {
            title: req.body.title,
            content: req.body.content,
            thumbnail: req.body.thumbnail,
            post_date: req.body.postDate,
            slug: `${postSlug}-${req.params.id}`,
            status: status,
        }
        const isUpdate = await Post.update(data, {where: {id: req.params.id}});
        const categories = await Category.findAll();
        let requestCategories = req.body.categories || [];
        requestCategories = await requestCategories.filter((value1) => categories.find((value2) => parseInt(value1) === value2.id));
        const results = await post.setCategories(requestCategories);
        return res.status(200).json({isUpdate: isUpdate ? true : false});
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}
exports.destroy = async(req,res) => {
    try {
        let post = {};
        await check("id")
            .custom((value) => Post.findOne({where: {id: value}})
                                .then((res) => {
                                    post = res;
                                    if(!res) return Promise.reject("Lỗi! Mục này không tồn tại.")
                                })
            )
            .run(req);
        validationResult(req).throw();
        await post.setCategories([]);
        const isDestroy = await Post.destroy({where: {id: req.params.id}});
        console.log(isDestroy)
        return res.status(200).json({isDestroy: isDestroy ? true : false});
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}
exports.trash = async(req,res) => {
    try {
        let post = {};
        await check("id")
            .custom((value) => Post.findOne({where: {id: value}})
                                .then((res) => {
                                    post = res;
                                    if(!res) return Promise.reject("Lỗi! Mục này không tồn tại.")
                                })
            )
            .run(req);
        validationResult(req).throw();
        const isUpdate = await Post.update({
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
        let post = {};
        await check("id")
            .custom((value) => Post.findOne({where: {id: value}})
                                .then((res) => {
                                    post = res;
                                    if(!res) return Promise.reject("Lỗi! Mục này không tồn tại.")
                                })
            )
            .run(req);
        validationResult(req).throw();
        const isUpdate = await Post.update({
            status: 'public'
        }, {where: {id: req.params.id}});
        console.log(isUpdate)
        return res.status(200).json({isUpdate: isUpdate ? true : false});
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}
exports.autosave = async(req,res) => {
    try {
        let post = {};
        await check("id")
            .custom((value) => Post.findOne({where: {id: value}})
                                .then((res) => {
                                    post = res;
                                    if(!res) return Promise.reject("Lỗi! Mục này không tồn tại.")
                                })
            )
            .run(req);
        validationResult(req).throw();
        const isUpdate = await Post.update({
            content: req.body.content
        }, {where: {id: req.params.id}});
        return res.status(200).json({isUpdate: isUpdate ? true : false});
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}
exports.getCategoryByPost = async(req, res) => {
    try {
        let data;
        await check("id")
            .notEmpty().withMessage("Bài viết không tồn tại")
            .bail()
            .custom((value) => 
                Post.findOne({ where: { id: parseInt(value) } })
                    .then((res) => {
                        if (res) {
                            data = res;
                        } else {
                            return Promise.reject("Bài viết không tồn tại")
                        }
                    }).catch((error) => Promise.reject("Bài viết không tồn tại")))
            .run(req)
        validationResult(req).throw();
        const response = await data.getCategories();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}
