// importing the express app from backend folder 
const app = require('./backend/app');

// importing http metaware to access server
const http = require('http');

// import debug, this will be used to help autosave with nodemon
const debug = require('debug')('node-angular'); 

// normalizePort verifiyer, it ensures that the port value is a valid number
const normalizePort = val => {
    var port = parseInt(val, 10);

    if (isNaN(port)){
        return val;
    }

    if (port >=0){
        return port;
    }

    return false;
};

// an error function, it will listen to the error and exit the server if an error is found
const onError = error => {
    if(error.sycall !== 'listen') {
        throw error;
    }

    const bind = typeof addr === 'string' ? 'pipe' + addr : 'port' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

// A listen function that will log, that we are now listening to incoming requests
const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe' + addr : 'port' + port;
    debug('Listening on ' + bind);
}

// creating a port so we can listen to requests and responses, using the normalizePort function
const port = normalizePort(process.env.PORT || 3000);

// seting port
app.set('port', port);

// passing the express server through to the node server
const server = http.createServer(app);

// registering the error handling for server
server.on('error', onError);

// regestering the listening function for server
server.on('listening', onListening);

// listing to the port for updates
server.listen(port);