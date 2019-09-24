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
  if(!genre && !country && !avg_vote) {
    res.status(400).json({error: 'Must provide a search query'});
  }
  if (genre ) {
    let movieByGenre = movies.filter( movie =>
      movie.genre.toLowerCase().includes(genre.toLowerCase())
    );
    res.status(200).json(movieByGenre);
  }
  if (country) {
    let movieByCountry = movies.filter( movie => 
      movie.country.toLowerCase().includes(country.toLowerCase())
    );
    res.status(200).json(movieByCountry);
  }
  if (avg_vote) {
    let movieByVote = movies.filter( movie => {
      const avg = parseFloat(avg_vote);
      return parseFloat(movie.avg_vote) >= avg;
    });
    res.status(200).json(movieByVote);
  }
}

app.get('/movies', handleGetMovies);

app.listen(8000, () => {
  console.log('Server listening');
});