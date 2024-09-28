const { Router } = require('express')
const uploadConfig = require("../configs/upload")
const multer = require('multer')

const usersRoutes = Router()

const UsersController = require('../controllers/UsersController')
const usersController = new UsersController()

const UserAvatarController = require("../controllers/UserAvatarController")
const userAvatarController = new UserAvatarController()

const upload = multer(uploadConfig.MULTER)

const ensureAuthenticated = require('../middleware/ensureAuthenticated')

usersRoutes.post('/', usersController.create)
usersRoutes.put('/', ensureAuthenticated, usersController.update)
usersRoutes.patch('/avatar', ensureAuthenticated, upload.single("avatar"), userAvatarController.update)




module.exports = usersRoutes
