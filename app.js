const express = require("express");
const dotenv = require("dotenv").config();

const app =  express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/Users",require("./src/routes/UserRoutes"));


app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
});