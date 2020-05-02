const router = require('express').Router();
const axios = require('axios');
const util = require('util');
const mongoose = require('mongoose')
const Trip = require('../models/trip')

require('dotenv').config();

// Get predictions for stop id
router.route('/:id').get(checkApiKey, checkStopId, (req, res) => {
  // Create the url. TRUE_TIME_PREDICTIONS_URL must specify %d as a stop id parameter
  const url = util.format(process.env.TRUE_TIME_PREDICTIONS_URL, req.params.id);
  axios.get(url)
    .then(getRes => getRes.data['bustime-response'].prd) // Get prd array from response
    .then(prds => mapPrdsToPredictions(prds)) // Convert to prediction objects
    .then(predictions => res.json({'predictions': predictions})) // Return json
    .catch(error => res.status(500).json({message: "Unable to get predictions for stop with id " + req.params.id, 'error': error}));
});

async function mapPrdsToPredictions(prds) {
  if (Array.isArray(prds) && prds.length > 0) {
    // array exists and is not empty
    const tripIds = prds.map(prd => prd.tatripid);
    const blockIds = prds.map(prd => prd.tablockid.replace(/\s+/g, ''));
    const trips = await Trip.find({$and:[ 
      { trip_id: { $in: tripIds } }, 
      { block_id: { $in: blockIds } }
    ]}, '');

    const titleMap = new Map(trips.map(trip => [trip.trip_id, trip.title]));
        
    return prds.map(prd => ({
      vehicleId: prd.vid,
      route: prd.rt,
      routeTitle: titleMap.get(prd.tatripid),
      arrivalTime: parseDate(prd.prdtm)
    }));
  } else {
    return []
  }
}

function parseDate(dateString) {
  // Parses strings like 20200420 22:29
  const match = dateString.match(/^(\d{4})(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\s([01]\d|2[0-3]):([0-5][0-9])$/);
  if (match) {
    return new Date(+match[1], +match[2] - 1, +match[3], +match[4], +match[5]).getTime() / 1000
  } else {
    return null
  }
}

function checkStopId(req, res, next) {
  if (isNaN(req.params.id)) {
    return res.status(401).json({message: 'Request must specify a valid numeric stop id'});
  }
  next();
}

function checkApiKey(req, res, next) {
  if (process.env.API_KEY != req.query.key) {
    return res.status(401).json({message: 'Request must specify a valid API key'});
  }
  next();
}

module.exports = router;