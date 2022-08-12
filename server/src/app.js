const express = require("express");
const path = require("path");

const v1Router = require("./routes/v1/v1Router");

const app = express();

// app.use(morgan('combined'))

app.disable('x-powered-by');
app.use(express.json());

app.use("/v1", v1Router);

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/*", (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;