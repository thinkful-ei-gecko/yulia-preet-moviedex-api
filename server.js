'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const movies = require('./moviestore.json');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

//function for validation
app.use(function validateBearerToken(req, res, next){
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')
  if(!authToken || authToken.split(' ')[1] !== apiToken){
    return res.status(401).json({ error: 'Unauthorized request made'})
  }
  next()
})

//function for requesting the movies by user query
function handleGetMovies(req, res) {
  const { genre, country, avg_vote} = req.query;
  let result = movies;

  if (genre ) {
    result = result.filter( movie =>
      movie.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }
  if (country) {
    result = result.filter( movie => 
      movie.country.toLowerCase().includes(country.toLowerCase())
    );
  }
  if (avg_vote) {
    result = result.filter( movie => {
      const avg = parseFloat(avg_vote);
      return parseFloat(movie.avg_vote) >= avg;
    });
  }
  return res.status(200).json(result);
}

app.get('/movies', handleGetMovies);

app.listen(8000, () => {
  console.log('Server listening');
});