//Definition of the services

'user strict';

const { json } = require('body-parser');
const request = require('request')

var arrivals = {

    getArrivalsAPI: async function (req, res, next) {

        request('https://opensky-network.org/api/flights/arrival?airport='+req.params.airport+'&begin='+req.params.begin+'&end='+req.params.end,
        
        function (error,response) {
            if (!error && response.statusCode == 200){
                var data={};
                var body = response.body
                body = JSON.parse(body)
                data['arrivals']=body.map(item=> {return {departureAirport:item.estDepartureAirport, callsign:item.callsign, departureAirportHorDistance:item.estDepartureAirportHorizDistance}})
                res.send(data);
                console.log(data)
            }
            else {
                console.log(response.statusCode + response.body)
                res.send("Error");
            }
        })
    }
};

module.exports = arrivals
