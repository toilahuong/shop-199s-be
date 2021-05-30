const { check, validationResult } = require('express-validator');
const slug = require('slug');
const db = require('../models/index');
const Post = db.posts;
const Category = db.categories;
exports.create = async (req,res) => {
    try {
        await check("title")
            .notEmpty().withMessage("Không được để trống tên")
            .run(req);
        validationResult(req).throw();
        const status = req.body.status || 'pending';
        const post_type = req.body.post_type || 'post';
        const data = {
            title: req.body.title,
            content: req.body.content,
            thumnail: req.body.thumnail,
            post_type: post_type,
            status: status,
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
exports.getAll = async(req,res) => {
    try {
        const post_type = req.query.post_type || 'post';
        const allPost = await Post.findAll({where: {post_type: post_type}});
        return res.status(200).json(allPost);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

exports.getById = async(req,res) => {
    try {
        console.log(req.params.id);
        let post = {};
        await check("id")
            .custom((value) => Post.findOne({where: {id: value}})
                                .then((res) => {
                                    post = res;
                                    if(!res) return Promise.reject("Lỗi! Sản phẩm không tồn tại.")
                                })
            )
            .run(req);
        validationResult(req).throw();
        console.log(post)
        return res.status(200).json(post);
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}
exports.edit = async (req,res) => {
    try {
        let post = {};
        await check("id")
            .custom((value) => Post.findOne({where: {id: value}})
                .then((res) => {
                    post = res;
                    if(!res) return Promise.reject("Lỗi! Bài viết này không tồn tại.")
                })
            )
            .run(req);
        await check("title")
            .notEmpty().withMessage("Không được để trống tên")
            .run(req);
        validationResult(req).throw();
        const status = req.body.status || 'pending';
        const postSlug = await slug(req.body.title);
        const data = {
            title: req.body.title,
            content: req.body.content,
            thumnail: req.body.thumnail,
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
                                    if(!res) return Promise.reject("Lỗi! Sản phẩm không tồn tại.")
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
        res.status(400).json(error);
    }
}
exports.getPostByCategory = async (req,res) => {
    try {
        const post = await Post.findOne({where: {id: req.params.id}});
        const allPosts = await post.getCategories();
        console.log(allPosts);
        return res.status(200).json(allPosts);
    } catch (error) { 
        return res.status(400).json(error);
    }
}