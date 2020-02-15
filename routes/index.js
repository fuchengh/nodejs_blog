require('../lib/db.js');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Blog = mongoose.model('Blog');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.locals.username = req.session.user;
    res.locals.authenticated = req.session.logined;
    Blog.find((err, blogs) => {
        res.render("index", {
            title: "My Blog",
            blogs: blogs.reverse()
        });
    })
});

module.exports = router;
