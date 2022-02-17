const express = require("express");
const config = require("config");
const chalk = require("chalk");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const initDatabase = require("./startUp/initDatabase");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api", routes);

const PORT = config.get("port") ?? 8080;

if (process.env.NODE_ENV === "production") {
    console.log(chalk.bgCyanBright("Production"));
} else {
    console.log(chalk.bgCyanBright("Development"));
}

if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.join(__dirname, "client")));
    const indexPath = path.join(__dirname, "client", "index.html");
    app.get("*", (req, res) => {
        res.sendFile(indexPath);
    });
}

async function start() {
    try {
        mongoose.connection.once("open", () => {
            initDatabase();
        });
        await mongoose.connect(config.get("mongoUri"));
        console.log(chalk.bgGreen("MongoDB connected."));
        app.listen(PORT, () =>
            console.log(
                chalk.bgGreen(`Server has been started on port ${PORT}...`)
            )
        );
    } catch (error) {
        console.log(chalk.bgRedBright(error.message));
        process.exit(1);
    }
}

start();
