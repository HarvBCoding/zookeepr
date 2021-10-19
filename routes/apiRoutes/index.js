const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');

// employing the router & having it use the module exported from animalRoutes.js
router.use(animalRoutes);

router.use(require('./zookeeperRoutes'));

module.exports = router;