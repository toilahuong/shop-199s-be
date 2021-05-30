const db = require('../models/index');
const User = db.users;
const checkPermission = (name,user_id) => new Promise(async (resolve, reject) => {
    try {
        const user = await User.findOne({where: {id: user_id}});
        const allRoles = await user.getRoles();
        let isCheck = false;
        for (let key in allRoles) {
            const permissions = await allRoles[key].getPermissions({where:{name: name},raw: true,nest: true});
            if(permissions.length > 0) {
                isCheck = true;
                break;
            }
        }
        console.log(isCheck);
        resolve(isCheck);
    } catch(error) {
        console.log(error);
        reject(error);
    }
}) 
exports.addProduct = async (req,res,next) => {
    try {
        const user_id = req.user_id;
        const isCheck = await checkPermission('add_product',user_id);
        if(!isCheck) throw {errors: [{msg: "Bạn không có quyền truy cập vào trang này"}]};
        next();
    } catch(error) {
        console.log(error);
        return res.status(401).json(error);
    }
}
exports.admin = async(req,res,next) => {
    try {
        const user_id = req.user_id;
        const user = await User.findOne({where: {id: user_id}});
        const allRoles = await user.getRoles();
        console.table(allRoles);
        if(allRoles.length === 0) throw {errors: [{msg: "Bạn không có quyền truy cập vào trang này"}]};
        next();
    } catch(error) {
        console.log(error);
        return res.status(401).json(error);
    }
}

// exports.allPermissionOfUser = async (req,res,next) => {
//     try {
//         const user_id = parseInt(req.body.user_id);
//         const user = await User.findOne({where: {id: user_id}});
//         const allRoles = await user.getRoles();
//         let allPermissions = [];
//         await Promise.all(Object.values(allRoles).map(async (role) => {
//             const permissions = await role.getPermissions({ raw: true,nest: true,})
//             allPermissions = [...allPermissions,...permissions]
//             return allPermissions;
//         },{}));
//         await Promise.all(Object.values(allPermissions).map((value,index,arr) =>{
//             const idx = arr.findIndex((val,i) => val.id === value.id && i !== index);
//             if(idx !== -1)arr.splice(idx,1);
//             console.table(arr);
//             return allPermissions = [...arr];
//         }));
//         console.table(allPermissions);
//         return res.status(200).json(allPermissions)
//     } catch(error) {
//         console.log(error);
//         return res.status(400).json(error);
//     }
// }