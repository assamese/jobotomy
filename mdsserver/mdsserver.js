'use strict';


/**
 * REST-server (fabricated via Swagger) to support CRUD on Jobs Database
 * Swagger-ui is available on http://localhost:<serverPort>/docs
 * Server is listening on (http://localhost:serverPort)
 */
var serverPort = 3000;

var app = require('connect')();
var http = require('http');
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var fs = require('fs');
var morgan = require("morgan");
var mongoose = require("mongoose");
var config = require("./config");
var cors = require('cors');



/**
 * Connecting to MongoDB using Mongoose.
 */
mongoose.connect(config.database, function (err) {
    if (err) {
        console.error(err);
    } else {
        console.log("Connected to database");
    }
});


// swaggerRouter configuration
var options = {
  swaggerUi: '/swagger.json',
  controllers: './controllers',
  useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
};

app.use(cors());

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync('./api/swagger.yaml', 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  // Start the server
  http.createServer(app).listen(serverPort, function () {
    console.log('Techskills server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });
});
