//Definition of the routes

'use strict';

const controller = require("./controller");

module.exports = function (app) {
    app.route("/api/v1/opensky/stats/:airport/:begin/:end")
    .get(controller.getArrivals);
};
