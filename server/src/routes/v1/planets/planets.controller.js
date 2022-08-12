const { getAllPlanets, addPlanet } = require("../../../models/planets.model");

async function httpGetAllPlanets(req, res){
    return res.status(200).json(await getAllPlanets());
}

async function httpAddPlanet(req, res){
    const { planet } = req.body;
    console.log(req.body);
    
    if(!planet || !planet.keplerName){        
        return res.status(400).json({ error: "Invalid planet"});
    }

    const newPlanet = await addPlanet(planet);
    return res.status(201).json({ newPlanet })
}

module.exports = {
    httpGetAllPlanets,
    httpAddPlanet
}