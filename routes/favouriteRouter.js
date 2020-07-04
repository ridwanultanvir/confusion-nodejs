const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const favourites = require('../models/favourites');
const cors = require('./cors');
const { response } = require('express');

const favouriteRouter = express.Router();

favouriteRouter.use(bodyParser.json());

favouriteRouter.route('/')
    .get(authenticate.verifyUser, (req, res, next) => { //correct
        favourites.findOne({ user: req.user._id })
            .populate('dishes.dish')
            .populate('user')
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(dishes);
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("put operation not supported on favourites ");
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        favourites.findOne({ user: req.user._id })
            .then((user) => {
                if (user) {
                    let favouriteDishes = req.body;
                    for (let i = 0; i < favouriteDishes.length; i++) {
                        user.dishes.push({ dish: favouriteDishes[i] });
                    }
                    user.save()
                        .then((favs) => {
                            favourites.findById(favs._id)
                                .populate('user')
                                .populate('dishes.dish')
                                .then((fav) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-type', 'application/json');
                                    res.json(fav);
                                }, (err) => next(err))
                                .catch((err) => next(err));
                        }, (err) => next(err))
                        .catch(err => next(err));
                }
                else {
                    favourites.create({ user: req.user._id })
                        .then((user) => {
                            let favouriteDishes = req.body;

                            for (let i = 0; i < favouriteDishes.length; i++) {
                                user.dishes.push({ dish: favouriteDishes[i] });
                            }
                            user.save()
                                .then((favs) => {
                                    favourites.findById(favs._id)
                                        .populate('user')
                                        .populate('dishes.dish')
                                        .then((fav) => {
                                            res.statusCode = 200;
                                            res.setHeader('Conetent-type', 'application/json');
                                            res.json(fav);
                                        }, (err) => next(err))
                                        .catch((err) => next(err));
                                })
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
            })
    })
    .delete(authenticate.verifyUser, (req, res, next) => { //working correctly
        favourites.findOneAndRemove({ user: req.user._id })
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

favouriteRouter.route('/:dishId')
    .get(authenticate.verifyUser, (req, res, next) => {
        favourites.findOne({ user: req.user._id })
            .then((favorites) => {
                if (!favorites) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    return res.json({ "exists": false, "favorites": favorites });
                }
                else {
                    if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        return res.json({ "exists": false, "favorites": favorites });
                    }
                    else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        return res.json({ "exists": true, "favorites": favorites });
                    }
                }

            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on favourites/" + req.params.dishId);
    })
    .post(authenticate.verifyUser, (req, res, next) => { //correct

        favourites.findOne({ user: req.user._id })
            .then((user) => {
                if (user !== null) {


                    let dishesLength = user.dishes.length;
                    let present = false;

                    for (let i = 0; i < dishesLength; i++) {

                        if (user.dishes[i].dish._id == req.params.dishId) {
                            present = true;
                            break;
                        }
                    }

                    if (!present) { //correct

                        user.dishes.push({ dish: req.params.dishId });
                        user.save()
                            .then((user) => {

                                favourites.findById(user._id)
                                    .populate('user')
                                    .populate('dishes.dish')
                                    .then((user) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(user);
                                    })
                            }, (err) => next(err))
                            .catch((err) => next(err));
                    }
                    else { //correct

                        res.statusCode = 200;
                        res.setHeader('Content-type', 'application/json');
                        res.end('Dish is already in the favourites list');
                    }
                }
                else { //correct
                    favourites.create({ user: req.user._id })
                        .then((user) => {

                            user.dishes.push({ dish: req.params.dishId });
                            user.save()
                                .then((user) => {

                                    favourites.findById(user._id)
                                        .populate('dishes.dish')
                                        .populate('user')
                                        .then((user) => {

                                            res.statusCode = 200;
                                            res.setHeader('Content-type', 'application/json');
                                            res.json(user);
                                        }, (err) => next(err))
                                        .catch((err) => next(err));
                                }, (err) => next(err))
                                .catch((err) => next(err));
                        })
                }
            }, (err) => next(err))
            .catch((err) => {

                return next(err)
            });
    })
    .delete(authenticate.verifyUser, (req, res, next) => { //correct
        favourites.findOne({ user: req.user._id })
            .then((user) => {


                let len = user.dishes.length;

                for (let i = 0; i < len; i++) {
                    if (user.dishes[i].dish == req.params.dishId) {
                        user.dishes.id(user.dishes[i]._id).remove();
                        break;
                    }
                }

                user.save()
                    .then((user) => {

                        favourites.findById(user._id)
                            .populate('dishes.dish')
                            .populate('user')
                            .then((user) => {

                                res.statusCode = 200;
                                res.setHeader('Content-type', 'application/json');
                                res.json(user);
                            }, (err) => next(err))
                            .catch((err) => next(err));
                    }, (err) => next(err))
                    .catch((err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = favouriteRouter;