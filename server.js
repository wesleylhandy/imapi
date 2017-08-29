// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const axios = require('axios');
const moment = require('moment');

var assert = require('assert');

var mongo = require('mongodb').MongoClient;

var uri = 'mongodb://' + process.env.MLAB_USER + ':' + process.env.MLAB_PASS + '@ds135983.mlab.com:35983/devserver';

mongo.connect(uri, function(err, db){
  assert.equal(null, err);
  console.log("Successfully connected to MongoDB.");
  var collection = db.collection('search-history');

  // we've started you off with Express, 
  // but feel free to use whatever libs or frameworks you'd like through `package.json`.

  // http://expressjs.com/en/starter/static-files.html
  app.use(express.static('public'));

  // Google Custom Search API information
  const api_url = `https://www.googleapis.com/customsearch/v1?key=${process.env.API_KEY}&cx=${process.env.CX}`;
  const options = '&alt=json&safe=high&searchType=image&filter=1&num=10';

  // http://expressjs.com/en/starter/basic-routing.html
  app.get("/", function (request, response) {
    response.sendFile(__dirname + '/views/index.html');
  });

  app.get("/api/imagesearch/:term", function(req, res){
    const term = req.params.term;
    const offset = req.query.offset;
    const endpoint = api_url + options + '&q=' + term + (offset ? '&start=' + offset : '');
    collection.insert({term: term, timestamp: moment()});
    axios.get(endpoint).then(function(response){
    
      const results = response.data.items;

      const data = [];

      results.forEach(result=> data.push({url: result.link, snippet: result.snippet, thumbnail: result.image.thumbnailLink, context: result.image.contextLink}));

      res.json(data)}).catch(function(error) {

      if (error.response) {
        // The request was made and the server responded with a status code 
        // that falls out of the range of 2xx 
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received 
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of 
        // http.ClientRequest in node.js 
        console.error(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error 
        console.error('Error', error.message);
      }
      console.error(error.config);
    });
  });
  
  app.get("/api/latest", (req, res)=> {
    const searches = collection.find({}, {_id: 0, term: 1, timestamp: 1}).sort({timestamp: -1}).limit(10).toArray();
    res.json(searches.length ? searches : [{msg: 'No Data Available. Please add a new search term.'}]);
  });

  // listen for requests :)
  var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });
  
});
