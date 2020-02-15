require("../lib/db.js");
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Blog = mongoose.model("Blog");
const Comment = mongoose.model("Comment");

/* GET users listing. */
router.get('/register', function (req, res, next) {
    if (req.session.logined) {
        res.redirect("/");
        return;
    }
    res.render("users/register");
    res.end();
});

router.get('/login', function (req, res, next) {
    if (req.session.logined) {
        res.redirect("/");
        return;
    }
    res.render("users/login");
    res.end();
});

router.get('/logout', function (req, res, next) {
    req.session.logined = false;
    res.redirect("/");
    res.end();
});

router.get('/forget', function (req, res, next) {
    if (req.session.logined) {
        res.redirect("/");
        return;
    }
    res.render("users/forget");
    res.end();
});

router.get('/profile', function (req, res, next) {
    if (!req.session.logined || !req.session.user) {
        res.redirect("/");
        return;
    }
    res.locals.username = req.session.user;
    res.locals.authenticated = req.session.logined;
    Blog.find({ Username: req.session.user }, (err, blogs) => {
        res.render("users/profile", {
            blogs: blogs
        });
    })
});

router.get('/add_article', function (req, res, next) {
    if (!req.session.logined || !req.session.user) {
        res.redirect("/");
        return;
    }
    res.locals.username = req.session.user;
    res.locals.authenticated = req.session.logined;
    res.render("users/add_article");
    res.end();
});

router.get('/modify/:id', function (req, res, next) {
    if (!req.session.logined || !req.session.user) {
        res.redirect("/");
        return;
    }
    res.locals.username = req.session.user;
    res.locals.authenticated = req.session.logined;
    res.locals.messageId = req.params.id;
    Blog.find({ _id: req.params.id }, (err, blogs, count) => {
        res.render("users/modify", {
            blogs: blogs,
        });
    });
});

router.get('/message/:id', function (req, res, next) {
    res.locals.username = req.session.user;
    res.locals.authenticated = req.session.logined;
    res.locals.messageId = req.params.id;

    Blog.find({ _id: req.params.id }, (err, blogs, count) => {
        Comment.find({ MessageId: req.params.id }, (err, comments, count) => {
            res.render("users/message", {
                blogs: blogs,
                comments: comments
            })
        })
    });
});

module.exports = router;
