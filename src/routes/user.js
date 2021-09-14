const express = require('express')
const router = express.Router()
const Controller = require('../controllers/user')

router.get('/', Controller.list)
router.get('/:id', Controller.detail)
router.post('/', Controller.add)
router.delete('/:id', Controller.delete)
router.put('/', Controller.update)

module.exports = router