const axios = require('axios');
const Developer = require('../models/developer');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(request, response) {
        const developers = await Developer.find();
        return response.json(developers);
    },

    async store(request, response) {
        const {github_username, techs, latitude, longitude} = request.body;

        let developer = await Developer.findOne({github_username});

        if (!developer) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

            const {name = login, avatar_url, bio} = apiResponse.data;

            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [latitude, longitude]
            };

            developer = await Developer.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });
        }

        return response.json(developer);
    }
};
