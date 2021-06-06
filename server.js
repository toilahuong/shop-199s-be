const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const app = express();
app.use(express.static('public'));
app.use(cookieParser())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    // cookie: { 
    //     maxAge: 1000*60*60*12, 
    //     httpOnly: true,
    // }
}))
app.use(cors({credentials: true, origin: process.env.CLIENT}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
const PORT = process.env.PORT || 8888;




app.use((req,res,next) => {
    req.user_id = 1;
    next();
})
const apiRouter = require('./routers/api.route');
app.use('/api',apiRouter);

app.listen(PORT, (req,res) => {
    console.log(`SERVER CONNECTED WITH PORT: ${PORT}`);
})