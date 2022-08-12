const { getAllLaunches, saveLaunch, checkLaunchExists, abortLaunchById } = require("../../../models/launches.model");
const getPagination = require("../../../services/query");

async function httpGetAllLaunches(req, res) {    
    const { skip, limit } = getPagination(req.query);
    res.status(200).json(await getAllLaunches(skip, limit));
}

async function httpAddNewLaunch(req, res) {
    try {
        const newLaunch = req.body;

        // console.log({ newLaunch });

        if (!newLaunch.launchDate || !newLaunch.mission || !newLaunch.target || !newLaunch.rocket) {
            return res.status(400).json({
                error: "Missing required field(s)"
            });
        }

        newLaunch.launchDate = new Date(newLaunch.launchDate);

        if (isNaN(newLaunch.launchDate)) {
            return res.status(400).json({
                error: "Invalid date format"
            });
        }

        const launch = await saveLaunch(newLaunch);

        return res.status(201).json(launch);
    } catch (e) {
        const errorMessage = `An error occurred while attempting to save launch: ${e.message}`;

        console.log(errorMessage);
        return res.status(400).json({ error: errorMessage })
    }
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);

    const launchExists = await checkLaunchExists(launchId);

    // check launch existence
    if (!launchExists) {
        return res.status(404).json({ error: "Launch not found" });
    }

    // abort launch
    const aborted = await abortLaunchById(launchId);

    if(!aborted){
        return res.status(400).json({ error: "Could not abort launch. Check Launch ID "});
    }

    return res.status(200).json({ aborted: true });
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
};