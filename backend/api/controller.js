'user strict';

const arrivals = require('../services/arrivals');

var controller = {
    getArrivals: function(req,res){
        arrivals.getArrivalsAPI(req,res, function(err, data){
            if(err)
                res.send(err)
            res.json(data)
        }
        
        );
    },
};

module.exports = controller;
