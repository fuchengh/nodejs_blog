require('../lib/db.js');
const express = require('express');
const router = express.Router();
// Schemas from db.js
const mongoose = require('mongoose');
const Blog = mongoose.model('Blog');
const Comment = mongoose.model('Comment');
const User = mongoose.model('User');

router.get("/delete/:id", (req, res, next) => {
    Blog.remove({ _id: req.params.id }, (err) => {
        if (err) {
            console.log("Delete failed");
        }
        console.log("Delete completed");
    })
    res.redirect("/users/profile");
});

router.post("/register", (req, res, next) => {
    if (!req.body.user || !req.body.passwd) {
        res.redirect("/users/register");
        return;
    }
    // check if user already exists
    User.count({ Username: req.body.user }, function (err, count) {
        if (count > 0) {
            console.log("User already exists");
            res.redirect("/users/register");
            return;
        }
        // else, add to database
        req.session.user = req.body.user;
        req.session.passwd = req.body.passwd;
        req.session.logined = true;
        new User({
            Username: req.body.user,
            Password: req.body.passwd
        }).save((err) => {
            if (err) {
                console.log("Add user failed");
                return;
            }
            console.log("Add user success");
        });

        res.redirect("/");
    });
});

router.post("/login", (req, res, next) => {
    if (!req.body.user || !req.body.passwd) {
        res.redirect("/users/login");
        return;
    }
    User.count({ Username: req.body.user }, (err, count) => {
        // user exists
        if (count > 0) {
            User.findOne({ Username: req.body.user }, (err, user) => {
                if (user.Password != req.body.passwd) {
                    res.redirect("/users/login");
                    return;
                }
                // else, login succeeded
                req.session.user = req.body.user;
                req.session.passwd = req.body.passwd;
                req.session.logined = true;
                res.redirect("/");
                return;
            });
        }
        else {
            res.redirect("/users/login");
            return;
        }
    });
});

router.post("/add", (req, res, next) => {
    if (!req.session.logined || !req.session.user) {
        res.redirect("/");
        return;
    }

    // add new article
    new Blog({
        Username: req.session.user,
        Article: req.body.Content,
        CreatedAt: Date.now()
    }).save((err) => {
        if (err) {
            console.log("Failed to save article");
            return;
        }
        console.log("Saved article to db");
    });
    res.redirect("/");
});

router.post("/update/:id", (req, res, next) => {
    if (!req.params.id) {
        res.redirect("/");
        return;
    }
    Blog.update({ _id: req.params.id }, {
        Article: req.body.Content
    }, (err) => {
        if (err) {
            console.log("Update failed");
            return;
        }
        console.log("Update success");
    })
    res.redirect("/users/profile");
});

router.post("/comment/:id", (req, res, next) => {
    if (!req.params.id) {
        res.redirect("/");
        return;
    }
    new Comment({
        Visitor: req.body.visitor,
        MessageId: req.params.id,
        Comment: req.body.message,
        CreatedAt: Date.now()
    }).save((err) => {
        if (err) {
            console.log("Comment failed.");
            return;
        }
        console.log("Comment saved.");
        res.redirect("/users/message/" + req.params.id);
    })
});

router.post("/forget", (req, res, next) => {
    // check if user's email is in the database

    // otherwise, redirect to "/users/forget" and show a notification
});

module.exports = router;