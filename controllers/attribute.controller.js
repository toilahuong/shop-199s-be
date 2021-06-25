const { check, validationResult } = require('express-validator');
const db  = require('../models/index');
const Attribute = db.attributes;

exports.create = async(req, res) => {
    try {
        await check("name")
            .notEmpty().withMessage("Tên thuộc tính không được để trống")
            .run(req);
        validationResult(req).throw();
        const name = req.body.name;
        const value = req.body.value || null;
        const parent_id = parseInt(req.body.parent_id) || 0;
        const response = await Attribute.create({
            name: name,
            value: value,
            parent_id: parent_id
        });
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.json(error);
    }
}
exports.getAll = async(req,res) => {
    try {
        const parent_id = parseInt(req.query.parent_id) || null;
        let response = [];
        if(parent_id) response = await Attribute.findAll({order: [['id', 'ASC']],where: {parent_id: parent_id}});
        else response = await Attribute.findAll({order: [['id', 'ASC']]});
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.json(error);
    }
}
exports.getById = async (req, res) => {
    try {
        let attribute = {};
        await check("id")
            .custom((value) => Attribute.findOne({ where: { id: value } })
                .then((res) => {
                    attribute = res;
                    if (!res) return Promise.reject("Lỗi! Chuyên mục không tồn tại.")
                })
            )
            .run(req);
        validationResult(req).throw();
        console.log(attribute)
        return res.status(200).json(attribute);
    } catch (error) {
        console.log(error);
        return res.status(400).json(error);
    }
}
exports.destroy = async(req,res) => {
    try {
        let attribute = {};
        await check("id")
            .custom((value) => Attribute.findOne({where: {id: value}})
                                .then((res) => {
                                    attribute = res;
                                    if(!res) return Promise.reject("Lỗi! Sản phẩm không tồn tại.")
                                })
            )
            .run(req);
        validationResult(req).throw();
        // await attribute.setProducts([]);
        const isDestroy = await Attribute.destroy({where: {id: req.params.id}});
        console.log(isDestroy)
        return res.status(200).json({isDestroy: isDestroy ? true : false});
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}
exports.edit = async(req, res) => {
    try {
        await check("id")
            .custom((value) => Attribute.findOne({where: {id: value}})
                                .then((res) => {
                                    attribute = res;
                                    if(!res) return Promise.reject("Lỗi! Sản phẩm không tồn tại.")
                                })
            )
            .run(req);
        await check("name")
        .notEmpty().withMessage("Tên thuộc tính không được để trống")
            .run(req);
        validationResult(req).throw();
        const name = req.body.name;
        const value = req.body.value || null;
        const response = await Attribute.update({
            name: name,
            value: value,
        },{where: {id: req.params.id}});
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.json(error);
    }
}