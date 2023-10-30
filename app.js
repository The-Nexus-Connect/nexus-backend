const express = require("express");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

const app =  express();

const port = process.env.PORT || 5001;

connectDb();
app.use(express.json());
app.use("/api/users",require("./src/routes/UserRoutes"));
// app.use("/api/contests",require("./src/routes/ContestRoutes"));


app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
});