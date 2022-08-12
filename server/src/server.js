const http = require("http");

const app = require("./app");
const { loadSpaceXLaunchesData } = require("./models/launches.model");
const { connectToMongo } = require("./services/mongo");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
       const connected = await connectToMongo()

       // load and initialize our DB with spacex launch data
       await loadSpaceXLaunchesData();

       connected && server.listen(PORT, () => console.log(`Server listening for requests on port ${PORT}...`));
}
startServer(); 