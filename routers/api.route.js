const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const checkAuth = require('../middlewares/auth.middleware');
const csrfProtection = require('../middlewares/csrf.middleware');
router.get('/form', csrfProtection , (req,res) => res.json({ csrfToken: req.csrfToken() }));

router.post('/user/register',csrfProtection, AuthController.register);
router.post('/user/login',csrfProtection, AuthController.login);

router.use(checkAuth);

router.get('/user/get-info', AuthController.getInfo);
router.get('/user/get-user', AuthController.getUser);
router.put('/user/edit', csrfProtection, AuthController.updateUser);
router.put('/user/change-password', csrfProtection, AuthController.updatePasswordUser);



module.exports =  router;