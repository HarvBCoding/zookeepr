const path = require('path');
const router = require('express').Router();

// this GET route's ONLY job is to respond w/ an HTML page to display in the browser
router.get('/', (req, res) => {
    // res.sendFile() tells the GET router where to find the file the server needs to read and send back
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// GET route will respond w/ the animal's html page
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

// GET route will respond w/ the zookeepers html page
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

// the * will act as a wildcard, meaning any route that wasn't previously defined will fall under this
// and will receive the home page as a response
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router;