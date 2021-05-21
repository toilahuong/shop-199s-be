const express = require("express");
require('dotenv').config()
const app = express();
const PORT = process.env.PORT || 8888;
const apiRouter = require('./routers/api.route');
app.use('/api',apiRouter);
app.listen(PORT, (req,res) => {
    console.log(`SERVER CONNECTED WITH PORT: ${PORT}`);
})