const express = require('express')
const router = express.Router()

const homeController = require('../Controllers/homeControllers')
var auth = require('../middleware/adminAuth')

router.get('/', auth, homeController.home)

router.get('/user/:id', auth, homeController.selectId)

router.put('/user/:id', auth, homeController.update)

router.delete('/user/:id', auth, homeController.delete)

router.post('/user', auth, homeController.insert)

router.post('/user/gerar_token', auth, homeController.gerarToken)

router.post('/user/nova_senha', auth, homeController.novaSenha)

router.post('/user/login', homeController.login)

module.exports = router