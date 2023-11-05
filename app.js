const cluster = require('node:cluster');
const numCPUs = require('node:os').availableParallelism();
const express = require("express");
const cors = require("cors");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

const app = express();
const port = process.env.PORT || 5001;
const frontendUrl = [process.env.FRONTEND_URI, "http://localhost:3000"];
connectDb();

app.use(
  cors({
    origin: frontendUrl,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(express.json());


if (cluster.isPrimary) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
}

else{
app.use("/api/users", require("./src/routes/UserRoutes"));
app.use("/api/contests", require("./src/routes/ContestRoutes"));
app.use("/api/winner", require("./src/routes/CodechefWinnerRoutes"));
app.use("/api/announcements", require("./src/routes/AnnouncementsRoutes"));

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
}
