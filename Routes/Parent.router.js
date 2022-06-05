const express = require('express');
const router = express.Router();
const multer = require('../Middleware/multer.config')
const ParentController = require('../controllers/Parent.controller')
const Parent = require("../Models/Parent.model");
const { GetParentbymail, authentificateToken } = require('../controllers/Parent.controller');
const KidController = require('../controllers/Kid.controller');
const TaskController = require('../controllers/Task.controller');
const LocationController = require('../controllers/Location.controller');
/**
 * @Path /Parent
 */
router.post('/RegisterParent',ParentController.RegisterParent)
router.post('/Loginparent',ParentController.loginParent)
router.post('/Loginkid',ParentController.loginKid)
router.get('/getall',ParentController.Getall)
router.post('/:id/Registerkids',ParentController.RegisterKid)
router.post('/LoginwithSocial',ParentController.SigninwithSocialmedia)
router.get('/:id/getkids',KidController.Getkids)
router.post('/passforget', ParentController.motDePasseOublie)
router.post('/:id/addtask',TaskController.AddTask)
router.get('/:id/gettasks',TaskController.Gettasks)
router.put('/changepass', ParentController.changerMotDePasse)
router.post('/:id/addlocation',LocationController.Addlocation)
module.exports = router;