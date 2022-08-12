var mongoose = require('mongoose');

mongoose.connection.once("open", () => {
    console.log("Connected to mongodb");
});
mongoose.connection.on("error", (afterInitialConnectionError) => {
    console.log(`Mongoose (afterInitialConnectionError) error: ${afterInitialConnectionError}`);
});

const MONGO_URI = "mongodb+srv://stefan:m43cvHGWh0atHEuo@cluster0.n3v0o.mongodb.net/nasa?retryWrites=true&w=majority";

async function connectToMongo() {
    try{
        return await mongoose.connect(MONGO_URI);
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