const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser'); 
dotenv.config();        //will read the .env file

//Setting up server
const app = express();
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server started at: http://localhost:${PORT}`));

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000", "https://mohit-mern-authentication.netlify.app"],
    credentials: true,                   //server will send cookies to browser
}));

//Connect to mongodb
mongoose.connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err) return console.error(err);
    console.log("Database Connected");
});

//set routes
app.use("/auth", require("./routers/userRouter.js"));