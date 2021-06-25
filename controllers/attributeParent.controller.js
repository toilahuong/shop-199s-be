const { check, validationResult } = require('express-validator');
const db  = require('../models/index');
const AttributeParent = db.attribute_parent;
const Attribute = db.attributes;

exports.create = async(req, res) => {
    try {
        await check("name")
            .notEmpty().withMessage("Tên thuộc tính không được để trống")
            .run(req);
        validationResult(req).throw();
        const name = req.body.name;
        const desc = req.body.desc || null;
        const response = await AttributeParent.create({
            name: name,
            desc: desc,
        });
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.json(error);
    }
}
exports.getAll = async(req,res) => {
    try {
        const response = await AttributeParent.findAll({order: [['id', 'DESC']],include:[{model: Attribute}]});
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
            .custom((value) => AttributeParent.findOne({ where: { id: value } })
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
            .custom((value) => AttributeParent.findOne({where: {id: value}})
                                .then((res) => {
                                    attribute = res;
                                    if(!res) return Promise.reject("Lỗi! Sản phẩm không tồn tại.")
                                })
            )
            .run(req);
        validationResult(req).throw();
        await Attribute.destroy({where: {parent_id: req.params.id}});
        const isDestroy = await AttributeParent.destroy({where: {id: req.params.id}});
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
            .custom((value) => AttributeParent.findOne({where: {id: value}})
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
        const desc = req.body.desc || null;
        const response = await AttributeParent.update({
            name: name,
            desc: desc,
        },{where: {id: req.params.id}});
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.json(error);
    }
}