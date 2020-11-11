var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const dotenv = require('dotenv').config();
const validator = require('express-validator');
const mongoose = require('mongoose');
const underscore = require('underscore');
const pathConfig = require('./path');

// Define path
global.__path_app = __dirname + '/';
global.__path_configs = __path_app + pathConfig.folder_configs + '/';
global.__path_helpers = __path_app + pathConfig.folder_helpers + '/';
global.__path_routers = __path_app + pathConfig.folder_routers + '/';
global.__path_schemas = __path_app + pathConfig.folder_schemas + '/';
global.__path_models = __path_app + pathConfig.folder_models + '/';
global.__path_validates = __path_app + pathConfig.folder_validates + '/';
global.__path_middleware = __path_app + pathConfig.folder_middleware + '/';
global.__path_services = __path_app + pathConfig.folder_services + '/';

const services = require(path.resolve(__path_services));
global.__underscore = underscore;
global.__utils = new services.utils.utils();
global.__crypt = new services.crypt.crypt();
global.__jwt = new services.jwt();

// Define router
var authRouter = require('./routes/v1/auth');
// var userRouter = require('./routes/v1/users');
// var orderRouter = require('./routes/v1/orders');
var indexRouter = require('./routes/index');

// Apply mongo connect
const databaseConfig = require(__path_configs + 'collectionSchemas');
mongoose
    .connect(`mongodb+srv://${databaseConfig.db_user}:${databaseConfig.db_password}@cluster0-z9sry.mongodb.net/${databaseConfig.db_database}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log('DB Connection Error');
    });;

// Apply express
var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Allow/enable cross origin request
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

// Apply validate middleware
app.use(validator({
    customValidators: {
        isNotEqual: (value1, value2) => {
            return value1 !== value2;
        }
    }
}));

// Define router
app.use('/v1/auth', authRouter)
// app.use('/v1/user', userRouter);
// app.use('/v1/order', orderRouter);
app.use('/', indexRouter);

// Attach swagger UI generator
const expressSwagger = require('express-swagger-generator')(app);
let options = {
    swaggerDefinition: {
        info: {
            description: 'This API Docs is express the API design specification of Pre-Order Management system',
            title: 'Pre-Order Management System',
            version: '1.0.0',
        },
        host: 'localhost:3000',
        basePath: '/v1',
        produces: [
            'application/json',
            'application/xml'
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: '',
            }
        }
    },
    basedir: __dirname, // App absolute path
    files: ['./routes/**/*.js'] // Path to the API handle folder
};
expressSwagger(options)

// Error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    console.log(err);
    res.json('error');
});
const server = require('http').createServer(app);

module.exports = app;
