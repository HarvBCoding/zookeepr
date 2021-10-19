const fs = require("fs");
const path = require("path");

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
};

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
};

// function accept the POST route's req.body value & the array to add the data to
function createNewAnimal(body, animalsArray) {
    // the function's main code will go here
    const animal = body;
    animalsArray.push(animal);
    // the fs.writeFileSync() method is the synchronous version of fs.writeFile()
    fs.writeFileSync(
        // write to the animals.json file and use the path.join() method to join the value of __dirname
        // dirname represents the directory of the file the code is executed in
        path.join(__dirname, '../data/animals.json'),
        // use stringify to convert the JS array data; the arguments null & 2 are means of keeping the data formatted
        // null means none of the existing data can be edited, the 2 is to create whitespace btw the values for readability
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    // return finished code to post route for response
    return animal;
};

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
};

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};