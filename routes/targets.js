const router = require('express').Router()
const {getTargets, createTargets, getReport} = require('../controllers/targets')

router.get('/', getTargets)
router.post('/', createTargets)
router.get('/:targetName', getReport)

module.exports = router