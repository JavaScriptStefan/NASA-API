const Planet = require("./planets.mongo");

// const planets = [{kepler_name: 'Mars'}];

async function getAllPlanets(){
    return await Planet.find({}, {
        "_id": 0,
        "__v": 0
    });
}

async function addPlanet(planet){
    try{
        const newPlanet = Planet.updateOne({ keplerName: planet.keplerName }, { keplerName: planet.keplerName }, { upsert: true });
        console.log({ newPlanet });
        return newPlanet;
    }catch(e){
        throw new Error(`An error occurred while trying to save a new planet: ${e.message}`)
    }
}

module.exports = {
    getAllPlanets,
    addPlanet
};