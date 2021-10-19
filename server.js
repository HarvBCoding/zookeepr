const express = require('express');
const { animals } = require('./data/animals.json');
const fs = require('fs');
const path = require('path');

// when heroku runs it sets an environment variable called process.env.PORT
// this is telling our app to use that port if it's been set
const PORT = process.env.PORT || 3001;

// to represent the server; assign express() to the app variable so that methods can be chained to the Express.js server
const app = express();

// app.use() method that mounts a function to the server that requests will pass thru before getting to the intender endpoint
// express.urlencoded({ extended: true }) is a method that takes incoming POST data & converts it to key/value pairings that can be accessed in the req.body object
// parse incoming string or array data
app.use(express.urlencoded({ extended: true}));
// express.json() takes incoming POST data in the form of JSON & parses it into the req.body
// parse incoming JSON data
app.use(express.json());
// instructs the server to make files(in public directory) readily available
// the express.static() method takes the provided path to a location w/in the app and instructs the server to make the files static resources
app.use(express.static('public'));

// this function will extract data from after the question mark; taking req.query as an argument
// and filter through the animals accordingly, returning a new filtered array 
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];

    // the animalsArray is saved as filterdResults
    let filteredResults = animalsArray;

    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array
        // If personalityTraits is a string, place it into a new array and save
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // check the trait against each animal in the filteredResults array (which is essentially a copy of the animalsArray)
            // in this code block the copy array is being updated for each trait in the forEach() loop
            // for each trait being targeted by filter, the array will contain only the entries that contain the trait
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }

    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

// function accept the POST route's req.body value & the array to add the data to
function createNewAnimal(body, animalsArray) {
    // the function's main code will go here
    const animal = body;
    animalsArray.push(animal);
    // the fs.writeFileSync() method is the synchronous version of fs.writeFile()
    fs.writeFileSync(
        // write to the animals.json file and use the path.join() method to join the value of __dirname
        // dirname represents the directory of the file the code is executed in
        path.join(__dirname, './data/animals.json'),
        // use stringify to convert the JS array data; the arguments null & 2 are means of keeping the data formatted
        // null means none of the existing data can be edited, the 2 is to create whitespace btw the values for readability
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    // return finished code to post route for response
    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet!== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

// the get() method requires 2 arguments; the first is a string that describes the route the client will have to fetch from
// the second is a callback function that will execute every time that route is accessed w/ a GET request
app.get('/api/animals', (req, res) => {

    let results = animals;
    // uses the query property of req(request) to filter the search by the client after the ?
    if (req.query) {

        results = filterByQuery(req.query, results);

    }

    // the json() method from the res(response) to send the string
    res.json(results);

});

app.get('/api/animals/:id', (req, res) => {

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
app.post('/api/animals', (req, res) => {
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

// this GET route's ONLY job is to respond w/ an HTML page to display in the browser
app.get('/', (req, res) => {
    // res.sendFile() tells the GET router where to find the file the server needs to read and send back
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// GET route will respond w/ the animal's html page
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

// GET route will respond w/ the zookeepers html page
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// the * will act as a wildcard, meaning any route that wasn't previously defined will fall under this
// and will receive the home page as a response
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});