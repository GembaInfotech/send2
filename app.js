require("dotenv").config();
const express = require("express");

const adminRoutes = require("./routes/admin.route");
const userRoutes = require("./routes/user.route");
const postRoutes = require("./routes/post.route");
const communityRoutes = require("./routes/community.route");
const contextAuthRoutes = require("./routes/context-auth.route");
const search = require("./controllers/search.controller");
const Database = require("./config/database");
const decodeToken = require("./middlewares/auth/decodeToken");
const vehcileRoutes = require('./routes/vehicle.route.js')
const parkingRoutes = require('./routes/parking.route.js')
const bookingRoutes = require("./routes/booking.route.js")
const vendorRoute = require('./routes/vendor.route.js')
const paymentRoute = require('./routes/paymentRoute.js')
const guardRoutes = require('./routes/guard.route.js')
const parkingSpaceroute = require('./routes/parkingSpace.route.js')
const invoiceRoute = require('./routes/invoice.route.js')

const app = express();

const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");

const PORT = process.env.PORT || 3456;

const db = new Database(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

db.connect().catch((err) =>
  console.error("Error connecting to database:", err)
);

app.use(cors());
app.use(morgan("dev"));
app.use("/assets/userFiles", express.static(__dirname + "/assets/userFiles"));
app.use(
  "/assets/userAvatars",
  express.static(__dirname + "/assets/userAvatars")
);
app.use(express.static('dist'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
require("./config/passport.js");
require("./cronJobs/updateParkingStatus.js")

app.get("/server-status", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

app.get("/search", decodeToken, search);

app.use("/auth", contextAuthRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/communities", communityRoutes);
app.use("/admin", adminRoutes);
app.use("/vehicle", vehcileRoutes);
app.use("/v1/api/parking", parkingRoutes)
app.use("/v1/api/parkingSpace", parkingSpaceroute)

app.use("/v1/api/booking", bookingRoutes)
app.use("/v1/api/vendor", vendorRoute)
app.use("/booking", paymentRoute)
app.use("/v1/api/guard", guardRoutes)
app.use('/v1/api/invoice', invoiceRoute)



process.on("SIGINT", async () => {
  try {
    await db.disconnect();
    console.log("Disconnected from database.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}!`));
