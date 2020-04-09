const router = require('express').Router()
const Stop = require('../models/stop')

require('dotenv').config()

// Get stops in location bounds
router.route('/bounds').get(checkApiKey, (req, res) => {
  const north = req.query.north
  const south = req.query.south
  const west = req.query.west
  const east = req.query.east
  if (!north || !south || !west || !east) {
    res.status(400).json({message: "Request must specify all location bounds"})
    return
  }

  const bounds = {
    type: 'Polygon',
    coordinates: [[
      [north, west],
      [north, east],
      [south, east],
      [south, west],
      [north, west]
    ]]
  }

  Stop.find({
    location: {
      $geoWithin: {
        $geometry: bounds
      }
    }
  })
    .then(dbStops => dbStops.map(dbStop=>dbStopToObj(dbStop)))
    .then(stops => res.json(stops))
    .catch(error => res.status(500).json({message: "Unable to get stops within specified location bounds"}))
})

// Get stop by id
router.route('/:id').get(checkApiKey, (req, res) => {
  Stop.findOne( {_id: req.params.id} )
    .then(dbStop => dbStopToObj(dbStop))
    .then(stop => res.json(stop))
    .catch(error => res.status(500).json({message: "Unable to get stop with id " + req.params.id}))
})

function dbStopToObj(dbStop) {
  return {
    id: dbStop._id,
    title: dbStop.title,
    location: dbStop.location.coordinates, 
    routes: dbStop.routes
  }
}

function checkApiKey(req, res, next) {
  if (process.env.API_KEY != req.query.key) {
    return res.status(401).json({message: "Request must specify a valid API key"})
  }
  next()
}

module.exports = router