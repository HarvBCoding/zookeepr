const express = require('express');

// when heroku runs it sets an environment variable called process.env.PORT
// this is telling our app to use that port if it's been set
const PORT = process.env.PORT || 3001;

// to represent the server; assign express() to the app variable so that methods can be chained to the Express.js server
const app = express();

// the require() statements will read the index.js files in each of the directories indicated
// index.js will be the default file read if no other file is provided
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

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

// this is telling the server that any time a client navigates to <host>.api the app will use the router set in apiRoutes
app.use('/api', apiRoutes);
// if '/' is the endpoint then the router will serve back the HTML routes
app.use('/', htmlRoutes);

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});