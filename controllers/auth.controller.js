const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/index');
const User = db.users;
exports.register = async (req,res) => {
    try {
        await check("email")
            .notEmpty().withMessage('Email không được để trống')
            .bail()
            .normalizeEmail()
            .isEmail().withMessage('Đây không phải email')
            .bail()
            .custom((value) => {
                return User.findOne({where: {email: value}}).then((res) => {
                    if (res) {
                        return Promise.reject('Email đã tồn tại');
                    }
                })
            })
            .run(req);
        await check("full_name")
            .notEmpty().withMessage('Họ và tên không được để trống')
            .run(req);
        await check("phone")
            .notEmpty().withMessage('Số điện thoại không được để trống')
            .bail()
            .custom((value) => /([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/g.test(value)).withMessage('Số điện điện thoại không đúng')
            .bail()
            .custom((value) => {
                return User.findOne({where: {phone: value}}).then((res) => {
                    if (res) {
                        return Promise.reject('Số điện thoại đã tồn tại');
                    }
                })
            })
            .run(req);
        await check("password")
            .notEmpty().withMessage('Mật khẩu không được để trống')
            .bail()
            .isLength({ min: 6, max: 32 }).withMessage('Mật khẩu phải lớn hơn 6 và nhỏ hơn 32 ký tự')
            .run(req);
        await check("confirm_password")
            .custom((value, {req}) => value === req.body.password).withMessage('Mật khẩu không khớp')
            .run(req);
        validationResult(req).throw();
        req.body.password = await bcrypt.hash(req.body.password,10);
        delete req.body.confirm_password;
        const newUser = await User.create(req.body);
        return res.json(newUser).status(200);
    } catch (error) {
        return res.status(400).json(error);
    }
    
}
exports.login = async (req,res) => {
    try {
        let user = {};
        await check('email')
            .notEmpty().withMessage("Email không được để trống")
            .run(req);
        await check('password')
            .notEmpty().withMessage('Mật khẩu không được để trống')
            .bail()
            .custom((value, {req}) => {
                return User.findOne({where: {email: req.body.email}})
                    .then(res => {
                        user = {
                            _id: res.id,
                            full_name: res.full_name
                        }
                        return bcrypt.compare(value,res.password)
                    })
                    .then(res => {
                        if(!res) {
                            return Promise.reject('Tài khoản mật khẩu không chính xác');
                        }
                    })
                    .catch(() => Promise.reject('Tài khoản mật khẩu không chính xác')) 
            })
            .run(req);
        validationResult(req).throw();
        const token = await jwt.sign(user, process.env.TOKEN_SECRET, { algorithm: 'HS256', expiresIn: '12h' });
        req.session.token = token;
        return res.status(200).json({token: token});
    } catch (error) {
        return res.status(403).json(error);
    }
}
exports.getInfo = async (req,res) => {
    try {
        const response = await User.findOne({where: {id: req.user_id}});
        if (!response) throw new Error("Unauthorized");
        const data = {
            _id: response.id,
            full_name: response.full_name,
            address: response.address,
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(403).json(error);
    }
}
exports.getUser = async (req,res) => {
    try {
        let response = await User.findOne({where: {id: req.user_id}});
        if (!response) throw new Error("Unauthorized");
        console.log(response);
        let data= {...response.dataValues}
        delete data.password;
        return res.status(200).json(data);
    } catch (error) {
        return res.status(403).json(error);
    }
}
exports.updatePasswordUser = async (req,res) => {
    try {
        const user_id = req.user_id;
        await check("oldPassword")
            .notEmpty().withMessage('Mật khẩu không được để trống')
            .bail()
            .custom((value) => {
                return User.findOne({where: {id: user_id}})
                            .then((res) => bcrypt.compare(value,res.password))
                            .then((res) => {
                                if(!res) {
                                    return new Promise.reject("Mật khẩu không chính xác");
                                } 
                            })
                            .catch((err) => Promise.reject("Mật khẩu không chính xác"));
            }).withMessage('Mật khẩu không chính xác')
            .run(req);
        await check("newPassword")
            .notEmpty().withMessage('Mật khẩu không được để trống')
            .bail()
            .isLength({ min: 6, max: 32 }).withMessage('Mật khẩu phải lớn hơn 6 và nhỏ hơn 32 ký tự')
            .run(req);
        await check("confirmPassword")
            .custom((value, {req}) => value === req.body.newPassword).withMessage('Mật khẩu không khớp')
            .run(req);
        validationResult(req).throw();
        const newPassword = await bcrypt.hash(req.body.newPassword,10);
        const isUpdate = await User.update(
            {
                password: newPassword
            },
            {
                where: {id: user_id},
            })
        return res.status(200).json({
            isUpdate: isUpdate ? true : false
        });
    } catch (error) {
        return res.status(403).json(error);
    }
}

exports.updateUser = async (req,res) => {
    try {
        const user_id = req.user_id;
        await check('full_name')
            .notEmpty().withMessage("Họ và tên không được để trống")
            .run(req);
        await check('date_of_birth')
            .notEmpty().withMessage('Ngày sinh không được để trống')
            .run(req);
        await check('address')
            .notEmpty().withMessage('Địa chỉ không được để trống')
            .run(req);
        await check("phone")
            .notEmpty().withMessage('Số điện thoại không được để trống')
            .bail()
            .custom((value) => /([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/g.test(value)).withMessage('Số điện điện thoại không đúng')
            .bail()
            .custom((value) => {
                return User.findOne({where: {phone: value}}).then((res) => {
                    if (res && res.id != user_id) {
                        return Promise.reject('Số điện thoại đã tồn tại');
                    }
                })
            })
            .run(req);
        await check("password")
            .custom((value) => {
                return User.findOne({where: {id: user_id}})
                    .then(res => {
                        return bcrypt.compare(value,res.password)
                    })
                    .then(res => {
                        if(!res) {
                            return Promise.reject('Mật khẩu không chính xác');
                        }
                    })
                    .catch(() => Promise.reject('Mật khẩu không chính xác')) 
            }).withMessage('Mật khẩu không chính xác')
            .run(req);
        validationResult(req).throw();
        const isUpdate = await User.update(
            {
                full_name: req.body.full_name,
                date_of_birth: req.body.date_of_birth,
                phone: req.body.phone,
                address: req.body.address
            },
            {
                where: {id: user_id},
            })
        return res.status(200).json({
            isUpdate: isUpdate ? true : false
        });
    } catch (error) {
        return res.status(403).json(error);
    }
}

