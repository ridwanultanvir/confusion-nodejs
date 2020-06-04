const express = require("express");
const bodyParser = require('body-parser')

const leaderRouter = express.Router();


leaderRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('will send you all the leaders to you!');
    })
    .post((req, res, next) => {
        res.end("will add the promotion: " + req.body.name + " with details " + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("put operation not supported on leaders ");
    })
    .delete((req, res, next) => {
        res.end("deleting all leaders");
    });


leaderRouter.route('/:leaderId')
    .all((req, res, next) => { //will run for all methods (get put post delete)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next(); // this next() specifies that work is not complete. it will then go to the necessary method(get put post delete) according to request
    })
    .get((req, res, next) => {
        res.end('will send details of the leader: ' + req.params.leaderId);
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on leaders/" + req.params.leaderId);
    })
    .put((req, res, next) => {
        res.write("updating the leader: " + req.params.leaderId + "\n");
        res.end('will update the leader ' + req.body.name + " with description " + req.body.description);
    })
    .delete((req, res, next) => {
        res.end("deleting leader" + req.params.leaderId);
    });

module.exports = leaderRouter;