const router = require('express').Router();

const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');

// the get() method requires 2 arguments; the first is a string that describes the route the client will have to fetch from
// the second is a callback function that will execute every time that route is accessed w/ a GET request
router.get('/animals', (req, res) => {

    let results = animals;
    // uses the query property of req(request) to filter the search by the client after the ?
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    // the json() method from the res(response) to send the string
    res.json(results);
});

router.get('/animals/:id', (req, res) => {

    // the req object also has a params property [req.params]; the param object needs to be defines in the route path
    const result = findById(req.params.id, animals);

    // if the findById function found something, then return the result
    if (result) {
        res.json(result);
    } else {
        // otherwise send a 404 error to let the client know their request could not be found
        res.send(404);
    }
});

// w/ post requests the data can be packaged, usually as an object & send it to the server
router.post('/animals', (req, res) => {
    // set animal id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if(!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {

        // add animal to json file & animals array in this function
        const animal = createNewAnimal(req.body, animals);

        // req.body is where our incoming content will be so it's accessible & do something w/ it
        res.json(animal);
    }
});

module.exports = router;