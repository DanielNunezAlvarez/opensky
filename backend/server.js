const express = require('express')
const app = express()

var routes = require('./api/routes');
routes(app)

app.listen(8080, () => {
    console.log('Express WebServer listening on 8080')
  })
