const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/auth.controller');
const PermissionController = require('../controllers/permission.controller');
const CategoryController = require('../controllers/category.controller');
const ProductController = require('../controllers/product.controller');
const PostController = require('../controllers/post.controller');
const LibraryController = require('../controllers/library.controller');
const AttributeController = require('../controllers/attribute.controller');
const AttributeParentController = require('../controllers/attributeParent.controller');

const checkAuth = require('../middlewares/auth.middleware');
const checkRole = require('../middlewares/role.middleware');
const csrfProtection = require('../middlewares/csrf.middleware');


router.get('/form', csrfProtection , (req,res) => res.json({ csrfToken: req.csrfToken() }));

router.post('/user/register',csrfProtection, AuthController.register);
router.post('/user/login',csrfProtection, AuthController.login);
router.post('/user/login-admin',csrfProtection, AuthController.loginAdmin);

router.get('/category', CategoryController.getCategoryByQuery);
router.get('/category/all', CategoryController.getAll);
router.get('/category/tree', CategoryController.getTreeCategory);
router.get('/category/:id', CategoryController.getById);

router.get('/product', ProductController.getProductByQuery);
router.get('/product/:id', ProductController.getById);
router.get('/product/:id/category', ProductController.getProductByCategory);

router.get('/post', PostController.getPostByQuery);
router.get('/post/:id/category', PostController.getCategoryByPost);
router.get('/post/:id/:post_type', PostController.getById);

router.get('/library', LibraryController.getFileByQuery);
router.get('/library/:id', LibraryController.getFileById);

router.get('/attribute', AttributeController.getAll);
router.get('/attribute/:id', AttributeController.getById);

router.get('/attribute-parent', AttributeParentController.getAll);
router.get('/attribute-parent/:id', AttributeParentController.getById);
// router.use(checkAuth);


router.get('/user/get-info', AuthController.getInfo);
router.get('/user/get-user', AuthController.getUser);
router.post('/user/logout', csrfProtection, AuthController.logout);
router.put('/user/edit', csrfProtection, AuthController.updateUser);
router.put('/user/change-password', csrfProtection, AuthController.updatePasswordUser);


// router.use(checkRole.admin);


router.get('/user/get-admin', AuthController.getAdmin);

router.post('/library', LibraryController.upload);
router.delete('/library/:id', LibraryController.delete);

router.post('/permission', PermissionController.create);
router.get('/permission/:id', PermissionController.getByGroup);

router.post('/category', CategoryController.create);
router.put('/category/:id', CategoryController.edit);
router.put('/category/:id/:category_type', CategoryController.setDefault);
router.delete('/category/:id', CategoryController.destroy);

router.post('/post',PostController.create);
router.put('/post/:id',PostController.edit);
router.put('/post/:id/autosave',PostController.autosave);
router.put('/post/:id/trast', PostController.trash);
router.put('/post/:id/restore', PostController.restore);
router.delete('/post/:id', PostController.destroy);

router.post('/product',ProductController.create);
router.put('/product/:id',ProductController.edit);
router.put('/product/:id/autosave',ProductController.autosave);
router.put('/product/:id/trast', ProductController.trash);
router.put('/product/:id/restore', ProductController.restore);
router.delete('/product/:id', ProductController.destroy);

router.post('/attribute',AttributeController.create);
router.delete('/attribute/:id', AttributeController.destroy);
router.put('/attribute/:id',AttributeController.edit);

router.post('/attribute-parent',AttributeParentController.create);
router.delete('/attribute-parent/:id', AttributeParentController.destroy);
router.put('/attribute-parent/:id',AttributeParentController.edit);
module.exports =  router;