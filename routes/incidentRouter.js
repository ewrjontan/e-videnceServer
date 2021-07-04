const express = require('express');
const Incident = require('../models/incident');

const incidentRouter = express.Router();


incidentRouter.route('/')
.get((req, res, next) => {
    Incident.find()
    .then(incidents => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(incidents);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Incident.create(req.body)
    .then(incident => {
        console.log('Incident created ', incident);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(incident);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('Need to change PUT operation not supported on /incidents');
})
.delete((req, res, next) => {
    Incident.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


incidentRouter.route('/:incidentId')
.get((req, res, next) => {
    Incident.findById(req.params.incidentId)
    .then(incident => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(incident);    
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /incidents/${req.params.incidentId}`);
})
.put((req, res, next) => {
    Incident.findByIdAndUpdate(req.params.incidentId, {
        $set: req.body
    }, { new: true})
    .then(incident => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(incident);    
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Incident.findByIdAndDelete(req.params.incidentId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);    
    })
    .catch(err => next(err));
});


incidentRouter.route('/:incidentId/items')
.get((req, res, next) => {
    Incident.findById(req.params.incidentId)
    .then(incident => {
        if (incident) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(incident.items);
        } else{
            err = new Error(`Campsite ${req.params.incidentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Incident.findById(req.params.incidentId)
    .then(incident => {
        if (incident) {
            incident.items.push(req.body);
            incident.save()
            .then(incident => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(incident);
            })
            .catch(err => next(err)); 
        } else{
            err = new Error(`Campsite ${req.params.incidentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /campsites/${req.params.incidentId}/items`);
})
.delete((req, res, next) => {
    //deletes every document in collection
    Incident.findById(req.params.incidentId)
    .then(incident => {
        if (incident) {
            for(let i = (incident.items.length-1); i >= 0; i--){
                incident.items.id(incident.items[i]._id).remove();
            }
            incident.save()
            .then(incident => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(incident);
            })
            .catch(err => next(err)); 
        } else{
            err = new Error(`Campsite ${req.params.incidentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});


module.exports = incidentRouter;
