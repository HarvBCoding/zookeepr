const express = require('express');
const { animals } = require('./data/animals.json');

// to represent the server; assign express() to the app variable so that methods can be chained to the Express.js server
const app = express();

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

app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
});