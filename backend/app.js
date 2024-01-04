const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const fs = require("fs");
const path = require("path");
const https = require("https");

const COOKIE_SECRET = process.env.COOKIE_SECRET;
const ssl_options = {
    key: fs.readFileSync(path.join(__dirname, "ssl", "server.key")),
    cert: fs.readFileSync(path.join(__dirname, "ssl", "server.crt")),
};

const app = express();
require("dotenv/config");

const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");
const api = process.env.API_URL;

app.use(cors({
    origin: "https://localhost:4200",
    credentials: true,
}));
app.options("*", cors());

// Middlewares
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("tiny"));
app.use(cookieParser());
app.use(authJwt());
app.use(
    cookieSession({
        name: "session",
        httpOnly: true,
        secret: COOKIE_SECRET,
        secure: true,
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
        keys: ["sdjh7832jdso3r983nfdw983", "knf9832m78j32nfuy71324p09fjhd983"],
    })
);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);

const authRoutes = require("./routes/auth");
const mainCategoryRoutes = require("./routes/main-category");
const subCategoryRoutes = require("./routes/sub-category");
const categoriesRoute = require("./routes/categories");
const productRoute = require("./routes/new-product");
const userRoute = require("./routes/users");
const orderRoute = require("./routes/orders");
const ratingRoute = require("./routes/rating");
const cartRoute = require("./routes/cart");

// Routes

app.use(`${api}/auth`, authRoutes);
app.use(`${api}/main-categories`, mainCategoryRoutes);
app.use(`${api}/sub-categories`, subCategoryRoutes);
app.use(`${api}/products`, productRoute);
app.use(`${api}/categories`, categoriesRoute);
app.use(`${api}/users`, userRoute);
app.use(`${api}/orders`, orderRoute);
app.use(`${api}/ratings`, ratingRoute);
app.use(`${api}/cart`, cartRoute);

const dbConfig = require("./config/database.config.js");

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose
    .connect(dbConfig.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log("Successfully connected to the database");
    })
    .catch((err) => {
        console.log("Could not connect to the database. Exiting now...", err);
        process.exit();
    });

const server = https.createServer(ssl_options, app);
// listen for requests
server.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
