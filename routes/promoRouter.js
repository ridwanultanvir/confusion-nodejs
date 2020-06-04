const express = require("express");
const bodyParser = require('body-parser')

const promoRouter = express.Router();


promoRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('will send you all the promotions to you!');
    })
    .post((req, res, next) => {
        res.end("will add the promotion: " + req.body.name + " with details " + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("put operation not supported on promotions ");
    })
    .delete((req, res, next) => {
        res.end("deleting all promotions");
    });


promoRouter.route('/:promoId')
    .all((req, res, next) => { //will run for all methods (get put post delete)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next(); // this next() specifies that work is not complete. it will then go to the necessary method(get put post delete) according to request
    })
    .get((req, res, next) => {
        res.end('will send details of the promotion: ' + req.params.promoId);
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on promotions/" + req.params.promoId);
    })
    .put((req, res, next) => {
        res.write("updating the promotion: " + req.params.promoId + "\n");
        res.end('will update the promotion ' + req.body.name + " with description " + req.body.description);
    })
    .delete((req, res, next) => {
        res.end("deleting promotion" + req.params.promoId);
    });

module.exports = promoRouter;