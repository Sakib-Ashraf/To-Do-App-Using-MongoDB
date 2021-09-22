const express = require('express');
const mongoose = require('mongoose');
const todoHandler = require('./routeHandler/todoHandler');
const userHandler = require('./routeHandler/userHandler');
const cors = require('cors');
const app = express();


//app connection and middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

//database connection
mongoose.connect('mongodb://localhost/todos',)
    .then(() => console.log('Database Connection Successful'))
    .catch(err => console.log(err));

//App Route
app.use('/todo', todoHandler);
app.use('/user', userHandler);


//error handler
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);  
    } else {
        res.status(500).json({ error: err });
    }
};
app.use(errorHandler);

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
	console.log(`app is running successfully on port 3300`);
});