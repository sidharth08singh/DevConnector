const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

//Load Post Model
const Profile = require("../../models/Post");

//Load Post Validation
const validatePostInput = require("../../validation/post");


/**
 * @route   GET api/posts/test
 * @desc    Tests posts route
 * @access  Public
 */
router.get("/test", (req, res) => res.json({ msg: "Posts works" }));

/**
 * @route   POST api/posts
 * @desc    Create posts
 * @access  Private
 */
 router.post("/", passport.authenticate("jwt", { session: false }),(req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    console.log(errors);

    // Check validation
    if (!isValid) {
      // If any errors, send 400 with error object
      return res.status(400).json(errors);
    }

     const newPost = new Post({
       text: req.body.text,
       name: req.body.name,
       avatar: req.body.avatar,
       user: req.user.id
     });
     newPost.save().then(post => res.json(post));
});

module.exports = router;
