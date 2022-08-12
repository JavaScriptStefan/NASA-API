require("dotenv").config();
var mongoose = require('mongoose');

mongoose.connection.once("open", () => {
    console.log("Connected to mongodb");
});
mongoose.connection.on("error", (afterInitialConnectionError) => {
    console.log(`Mongoose (afterInitialConnectionError) error: ${afterInitialConnectionError}`);
});

async function connectToMongo() {
    try{
        // console.log(process.env.MONGO_URI);
        return await mongoose.connect(process.env.MONGO_URI);
    }catch(initialConnectionError){
        console.log(`Mongoose (initialConnectionError) error: ${initialConnectionError}`);
        return false;
    }
}

async function disconnectFromMongo(){
    await mongoose.disconnect();
}

module.exports = {
    connectToMongo,
    disconnectFromMongo
}