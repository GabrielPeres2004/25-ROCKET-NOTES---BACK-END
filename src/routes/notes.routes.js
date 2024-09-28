const { Router } = require('express')

const NotesControllers = require('../controllers/NotesControllers')

const notesRoutes = Router()

const ensureAuthenticated = require('../middleware/ensureAuthenticated')


const notesControllers = new NotesControllers()

notesRoutes.use(ensureAuthenticated)

notesRoutes.get('/', notesControllers.index)
notesRoutes.post('/', notesControllers.create)
notesRoutes.get('/:id', notesControllers.show)
notesRoutes.delete('/:id', notesControllers.delete)


module.exports = notesRoutes
