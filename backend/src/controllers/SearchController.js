const axios = require('axios');
const Developer = require('../models/developer');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(request, response) {
        const {latitude, longitude, techs} = request.query;

        const techsArray = (techs === undefined) ? [] : parseStringAsArray(techs);

        const developers = await Developer.find({
            techs: {
                $in: techsArray
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [latitude, longitude]
                    },
                    $maxDistance: 10000
                }
            }
        });

        return response.json(developers);
    }
};
