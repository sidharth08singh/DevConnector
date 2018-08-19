const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

//Load Post Model
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");


//Load Post Validation
const validatePostInput = require("../../validation/post");


/**
 * @route   GET api/posts/test
 * @desc    Tests posts route
 * @access  Public
 */
router.get("/test", (req, res) => res.json({ msg: "Posts works" }));

/**
 * @route   GET api/posts
 * @desc    GET posts
 * @access  Public
 */
 router.get("/", (req, res) => {
   Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json( { nopostsfound: "No posts found with that ID" }));
});

/**
 * @route   GET api/posts/:id
 * @desc    GET post by id
 * @access  Public
 */
 router.get("/:id", (req, res) => {
   Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json( { nopostfound: "No post found with that ID" }));
});

/**
 * @route   DELETE api/posts/:id
 * @desc    DELETE post by id
 * @access  Public
 */
 router.delete("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
   Profile.findOne( { user: req.user.id })
    .then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: "User not authorized"});
          }
          // Delete
          post.remove().then(() => res.json( { success: true}));
        })
        .catch(err => res.status(404).json( { postnotfound: "No post found" }))
      });
  });



/**
 * @route   POST api/posts
 * @desc    Create posts
 * @access  Private
 */
 router.post("/", passport.authenticate("jwt", { session: false }),(req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    
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
