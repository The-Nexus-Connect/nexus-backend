const express = require("express");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

const app =  express();

const port = process.env.PORT || 5001;

connectDb();
app.use(express.json());
app.use("/api/Users",require("./src/routes/UserRoutes"));


app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
});