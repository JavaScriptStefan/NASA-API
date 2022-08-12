const LaunchModel = require("./launches.mongo");
const Planet = require("./planets.mongo");
const launches = new Map();
const Axios = require("axios");

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

const launch = {
    flightNumber: 100, //launch.flight_number
    mission: "Kepler Exploration X", // launch.name
    rocket: "Explorer IS1", //launch.rocket.name
    launchDate: new Date("December 30, 2023"), // rocket.date_local
    target: "Kepler-442 b", // N/A
    customers: ["ZTM", "NASA"], // launch.payloads.customers
    upcoming: true, // launch.upcoming
    success: true  // launch.success
};

launches.set(launch.flightNumber, launch);

async function findLaunch(filter) {
    return await LaunchModel.findOne(filter);
}

async function checkLaunchExists(launchId) {
    return await findLaunch({ flightNumber: launchId });
}

async function populateDbWithSpaceXData(){
    
    const fetchBody = {        
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        "name": 1
                    }
                },
                {
                    path: "payloads",
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    }

    const response = await Axios.post(SPACEX_API_URL, fetchBody);

    // console.log({ response: response.data.docs });

    const launchDocs = response.data.docs;

    for (const launchDoc of launchDocs) {
        const launchData = {
            flightNumber: launchDoc.flight_number,
            mission: launchDoc.name,
            rocket: launchDoc.rocket.name,
            launchDate: new Date(launchDoc.date_local), 
            target: "Kepler-442 b", // N/A
            customers: launchDoc.payloads.map(payload => payload.customers[0]),
            upcoming: launchDoc.upcoming,
            success: launchDoc.success
        }

        console.log(launchData.flightNumber, launchData.mission);

        await LaunchModel.updateOne({ flightNumber: launchData.flightNumber }, launchData, { upsert: true });
    }

}

async function loadSpaceXLaunchesData() {
    console.log("Loading SpaceX launches data...");

    const firstLaunch = await findLaunch({
        flightNumber: 1,
        mission: 'FalconSat',
        rocket: 'Falcon 1',
    });

    if(firstLaunch){
        console.log("Launch data has already been loaded and persisted.");
        return;
    }else{
        populateDbWithSpaceXData();
    }
}

async function getAllLaunches(skip, limit) {
    return await LaunchModel.find({}, { "_id": 0, "__v": 0 }).skip(skip).limit(limit);
}

async function validatePlanet(launch) {
    return await Planet.findOne({ keplerName: launch.target }, { "_id": 0, "__v": 0 });
}

async function getLatestFlightNumber() {
    const launch = await LaunchModel.findOne({}).sort({ flightNumber: "desc" });

    if (!launch) {
        console.log("Using default flight number");
        return DEFAULT_FLIGHT_NUMBER;
    }

    return launch.flightNumber;
}

async function saveLaunch(launch) {
    const targetPlanet = await validatePlanet(launch);

    if (!targetPlanet) {
        throw new Error("[ITP] Invalid Target Planet - 5446");
    }

    // Get latest flight number
    const latestFlightNumber = await getLatestFlightNumber();
    // Attach it to the launch to be saved
    launch.flightNumber = latestFlightNumber + 1;

    Object.assign(launch, {
        upcoming: true,
        success: true,
        customers: ["ZTM", "NASA", "NOAA", "Clinton Ikechukwu"]
    });

    return await LaunchModel.findOneAndUpdate({
        flightNumber: launch.flightNumber
    },
        launch,
        {
            upsert: true,
            new: true
        }
    )
}

async function abortLaunchById(launchId) {
    const aborted = await LaunchModel.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    });

    return aborted['acknowledged'] && aborted['modifiedCount'] === 1 && aborted['matchedCount'] === 1;
}

module.exports = {
    loadSpaceXLaunchesData,
    getAllLaunches,
    checkLaunchExists,
    abortLaunchById,
    saveLaunch
};