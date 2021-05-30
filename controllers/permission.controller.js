const { check } = require('express-validator');
const db = require('../models/index');
const Permission = db.permissions;
const PermissionGroup = db.permission_groups;
exports.create = async (req,res) => {
    try {
        const newPermission = await Permission.create({
            name: req.body.name,
            group_id: req.body.group_id
        })
        return res.status(200).json(newPermission);
    } catch(error) {    
        console.log(error);
        return res.status(400).json(error);
    }
}
exports.getByGroup = async (req,res) => {
    try {
        const group = await  PermissionGroup.findOne({where: {id: parseInt(req.params.id)}});
        const permissions = await group.getPermissions();
        return res.status(200).json(permissions);
    } catch(error) {    
        console.log(error);
        return res.status(400).json(error);
    }
}