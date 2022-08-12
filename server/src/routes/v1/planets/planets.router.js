const express = require("express");

const { httpGetAllPlanets, httpAddPlanet } = require("./planets.controller");

const planetsRouter = express.Router();

planetsRouter.get("/", httpGetAllPlanets);
planetsRouter.post("/", httpAddPlanet);

module.exports = planetsRouter;