const { Router } = require('express')
const tagsRoutes = Router()

const TagsControllers = require('../controllers/TagsControllers')

const tagsControllers = new TagsControllers()

const ensureAuthenticated = require('../middleware/ensureAuthenticated')


tagsRoutes.get('/', ensureAuthenticated, tagsControllers.Index)


module.exports = tagsRoutes
