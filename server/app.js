const express = require("express");
const config = require("config");
const chalk = require("chalk");
const mongoose = require("mongoose");

const app = express();
const PORT = config.get("port") ?? 8080;

// if (process.env.NODE_ENV === "production") {
//     console.log(chalk.bgCyanBright("Production"));
// } else {
//     console.log(chalk.bgCyanBright("Development"));
// }

app.listen(PORT, () =>
    console.log(chalk.bgGreen(`Server has been started on port ${PORT}...`))
);
