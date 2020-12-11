const express = require('express');
const env = require('dotenv');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// routes
const userAuthRoutes = require('./routes/userAuth');
const adminAuthRoutes = require('./routes/admin/adminAuth');
// Environment variable 
env.config();

// mongodb connection
// mongodb+srv://root:<password>@vaibhav.qyu8r.mongodb.net/<dbname>?retryWrites=true&w=majority

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@vaibhav.qyu8r.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
    }
).then(() => {
    console.log(`Database ${process.env.MONGO_DB_DATABASE} is Connected`);
}).catch((err)=>{
    console.log(err)
});

// library to parse to post the data
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', userAuthRoutes);
app.use('/api', adminAuthRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server Running on port ${process.env.PORT}`);
});