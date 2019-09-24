'use strict';
const express = require('express');
const morgan = require('morgan');
const movies = require('./moviestore.js');

const app = express();

app.use(morgan('dev'));

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