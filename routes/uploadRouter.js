const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');


// multer configuration-------------------------------
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images'); //callback(error, destination)
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname); // callback(error, filename)
    }
});

const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('You can upload only image files!'), false);
    }
    callback(null, true);
}

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

//--------------------------------------------
const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
    .options(cors.corsWithOption, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("GET operation not supported");
    })
    .put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported");
    })
    .post(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(req.file);
    })
    .delete(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("DELETE operation not supported");
    })

module.exports = uploadRouter;