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



/*
For Items
*/

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



incidentRouter.route('/:incidentId/items/:itemId')
    .get((req, res, next) => {
        Incident.findById(req.params.incidentId)
        //.populate('comments.author')
        .then(incident => {
            if (incident && incident.items.id(req.params.itemId)) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(incident.items.id(req.params.itemId));
            } else if (!incident) {
                err = new Error(`Incident ${req.params.incidentId} not found`);
                err.status = 404;
                return next(err);
            } else{
                err = new Error(`Item ${req.params.itemId} not found`);
                err.status = 404;
                return next(err);
            }
        })
        .catch(err => next(err));
    })
    .post((req, res) => {
        res.statusCode = 403;
        res.end(`POST operation not supported on /incidents/${req.params.incidentId}/items/${req.params.itemId}`);
    })
    .put((req, res, next) => {
        Incident.findById(req.params.incidentId)
        //.populate('comments.author')
        .then(incident => {

            if (incident && incident.items.id(req.params.itemId)) {
                if (req.body.type){
                    incident.items.id(req.params.itemId).type = req.body.type;
                }

                if (req.body.locationFound){
                    incident.items.id(req.params.itemId).locationFound = req.body.locationFound;
                }

                if (req.body.description){
                    incident.items.id(req.params.itemId).description = req.body.description;
                }

                if (req.body.date){
                    incident.items.id(req.params.itemId).date = req.body.date;
                }

                incident.save()
                .then(incident => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(incident);
                })
                .catch(err => next(err));
            } else if (!incident) {
                err = new Error(`Incident ${req.params.incidentId} not found`);
                err.status = 404;
                return next(err);
            } else{
                err = new Error(`Item ${req.params.itemId} not found`);
                err.status = 404;
                return next(err);
            }
        })
        .catch(err => next(err));        
    })
    .delete((req, res, next) => {
        //deletes every document in collection
        Incident.findById(req.params.incidentId)
        .then(incident => {
            if (incident && incident.items.id(req.params.itemId)) {
                incident.items.id(req.params.itemId).remove();
                incident.save()
                .then(incident => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(incident);
                })
                .catch(err => next(err));
            } else if (!incident) {
                err = new Error(`Incident ${req.params.incidentId} not found`);
                err.status = 404;
                return next(err);
            } else{
                err = new Error(`Item ${req.params.itemId} not found`);
                err.status = 404;
                return next(err);
            }
        })
        .catch(err => next(err));
    });


module.exports = incidentRouter;
