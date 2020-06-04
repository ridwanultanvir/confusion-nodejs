const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
    .all((req, res, next) => { //will run for all methods (get put post delete)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next(); // this next() specifies that work is not complete. it will then go to the necessary method(get put post delete) according to request
    })
    .get((req, res, next) => {
        res.end('will send you all the dishes to you!');
    })
    .post((req, res, next) => {
        res.end("will add the dish: " + req.body.name + " with details " + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("put operation not supported on dishes ");
    })
    .delete((req, res, next) => {
        res.end("deleting all dishes");
    });

dishRouter.route('/:dishId')
    .all((req, res, next) => { //will run for all methods (get put post delete)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next(); // this next() specifies that work is not complete. it will then go to the necessary method(get put post delete) according to request
    })
    .get((req, res, next) => {
        res.end('will send details of the dish: ' + req.params.dishId);
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on dishes/" + req.params.dishId);
    })
    .put((req, res, next) => {
        res.write("updating the dish: " + req.params.dishId + "\n");
        res.end('will update the dish ' + req.body.name + " with description " + req.body.description);
    })
    .delete((req, res, next) => {
        res.end("deleting dish" + req.params.dishId);
    });

module.exports = dishRouter;