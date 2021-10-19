const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');
const zookeeperRoutes = require('../apiRoutes/zookeeperRoutes')

// employing the router & having it use the module exported from animalRoutes.js
router.use(animalRoutes);

router.use(zookeeperRoutes);

module.exports = router;