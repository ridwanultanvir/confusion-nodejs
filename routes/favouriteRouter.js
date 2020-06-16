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
                //console.log(dishes._id);
                // favourites.findById(dishes._id)  //doesn't populate the author in comments
                //     .populate('dish.comments.author')
                //     .then((dishes) => {
                //         res.statusCode = 200;
                //         res.setHeader('Content-type', 'application/json');
                //         res.json(dishes)
                //     }, (err) => next(err))
                //     .catch((err) => next(err));
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
                            console.log(favouriteDishes);
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
        res.statusCode = 403;
        res.end("GET operation not supported on favourites/" + req.params.dishId);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation not supported on favourites/" + req.params.dishId);
    })
    .post(authenticate.verifyUser, (req, res, next) => { //correct
        console.log('1');
        favourites.findOne({ user: req.user._id })
            .then((user) => {
                if (user !== null) {
                    console.log('2');
                    console.log(user);

                    let dishesLength = user.dishes.length;
                    let present = false;

                    for (let i = 0; i < dishesLength; i++) {
                        //console.log(user.dishes[i]._id);
                        if (user.dishes[i].dish._id == req.params.dishId) {
                            present = true;
                            break;
                        }
                    }

                    if (!present) { //correct
                        console.log('5');
                        console.log(user);
                        user.dishes.push({ dish: req.params.dishId });
                        user.save()
                            .then((user) => {
                                console.log('after 5 ');
                                console.log(user)
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
                        console.log('3');
                        res.statusCode = 200;
                        res.setHeader('Content-type', 'application/json');
                        res.end('Dish is already in the favourites list');
                    }
                }
                else { //correct
                    favourites.create({ user: req.user._id })
                        .then((user) => {
                            console.log(user);
                            user.dishes.push({ dish: req.params.dishId });
                            user.save()
                                .then((user) => {
                                    console.log("ulala ualala");
                                    console.log(user);
                                    favourites.findById(user._id)
                                        .populate('dishes.dish')
                                        .populate('user')
                                        .then((user) => {
                                            console.log("mairala mairala");
                                            console.log(user);
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
                console.log('4');
                return next(err)
            });
    })
    .delete(authenticate.verifyUser, (req, res, next) => { //correct
        favourites.findOne({ user: req.user._id })
            .then((user) => {
                console.log('1');
                console.log(user);

                let len = user.dishes.length;

                for (let i = 0; i < len; i++) {
                    if (user.dishes[i].dish == req.params.dishId) {
                        user.dishes.id(user.dishes[i]._id).remove();
                        break;
                    }
                }

                user.save()
                    .then((user) => {
                        console.log('2');
                        console.log(user);
                        favourites.findById(user._id)
                            .populate('dishes.dish')
                            .populate('user')
                            .then((user) => {
                                console.log("mairala mairala");
                                console.log(user);
                                res.statusCode = 200;
                                res.setHeader('Content-type', 'application/json');
                                res.json(user);
                            }, (err) => next(err))
                            .catch((err) => next(err));
                    }, (err) => next(err))
                    .catch((err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
    })


// .delete(authenticate.verifyUser, (req, res, next) => {
//     favourites.findOne({ user: req.user._id })
//         .then((user) => {
//             console.log('1');
//             console.log(user);
//             let dishIndex = user.dishes.indexOf(req.params.dishId);

//             let present = false;
//             let len = user.dishes.length;

//             for (let i = 0; i < len; i++){
//                 if (user.dishes[i].dish == req.params.dishId) {
//                     user.dishes[i].remove();
//                     break;
//                 }
//             }


//             console.log(dishIndex);
//             if (dishIndex !== -1) {
//                 console.log('2');
//                 user.dishes.id(user.dishes[dishIndex]._id).remove();
//                 user.save()
//                     .then((user) => {
//                         console.log('3');
//                         favourites.findOne(user._id)
//                             .populate('user')
//                             .populate('dishes.dish')
//                             .then((user) => {
//                                 console.log('4');
//                                 res.statusCode = 200;
//                                 res.setHeader('Content-Type', 'application/json');
//                                 res.json(user);
//                             }, (err) => next(err))
//                             .catch((err) => next(err));
//                     }, (err) => next(err))
//                     .catch((err) => next(err));
//             }
//         }, (err) => next(err))
//         .catch((err) => next(err));
// })

module.exports = favouriteRouter;