const express = require('express');
const { check } = require('express-validator');

const crudController = require('../controllers/crudController');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/add',isAuth, crudController.getAdd);
router.post('/add',[check('email').isEmail()],crudController.postAdd);

router.get('/get',isAuth,crudController.getAll);

router.get('/edit/:demoId',isAuth,crudController.geteditDemo);

router.delete('/delete/:itemId',isAuth, crudController.deleteItem);

router.get('/login',crudController.login);

router.get('/logout',isAuth,crudController.logout);

router.get('/',crudController.getIndex);

module.exports = router;