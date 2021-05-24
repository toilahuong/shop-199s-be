const jwt = require('jsonwebtoken');
const db = require('../models/index');
const User = db.users;
const checkAuth = async (req,res,next) => {
    try {
        if (!req.session.token) throw 'Unauth';
        const decoded = await jwt.verify(req.session.token, process.env.TOKEN_SECRET);
        const response = await User.findOne({where: {id: decoded._id}});
        if(!response) throw 'Unauth';
        req.user_id = decoded._id;
        next();
    } catch (error) {
        req.session.destroy();
        return res.status(401).json(error);
    }
}
module.exports = checkAuth;