const express = require('express');

const router = express.Router();

// Import multer for uploading images;
const multer = require('multer');

// import constructed mongoose object
const Post = require("../models/post");

const MINE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MINE_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mine type');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images');
  }, 
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MINE_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});



// starting metaware to get api's in the location  {using the get metaware}
router.get("", (req, res, next) => {
  console.log(req.query);
  const currentPage = +req.query.currentpage;
  const pageSize = +req.query.pagesize;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  // locate documents inside database, using find()
  postQuery
    // using a then block, like a promise, which will hold results
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();

    })
    .then(count => {
      // return data in a json format, executed inside the then block, as this is async code
      res.status(200).json({
        // a message that shows data was recieved successfully
        message: 'Post was successful',
        // shows the data recieved to be assigned to posts variable
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      // catach block to catch errors
      console.log(error);
    }); 
});

router.get("/:id", (req, res, next) => {

    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: 'Post not found'});
        }
    });
});

// only triggered by incoming post requests
router.post("", checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
  // Create the images url so we can display it... 
  const url = req.protocol + '://' + req.get('host');
  // creating a post constant to be able to pass post to server, which is managed by mongoose
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId,
  });
  // save method from mongoose, which automatically creates correct query to save into database
  post.save().then(createdPost => {
    // 201 is a code to show everything was successful
    res.status(201).json(
      // just a message showing the post was added successfully - dont really need it
      { message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id,
        }}
    );
  });
});

router.put('/:id', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
  let imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
    .then((result) => {
      if (result.nModified > 0) {
        res.status(200).json('Update Successdul');
      } else {
        res.status(401).json('Not authorised');
      }
    });
});

router.delete("/:id", checkAuth,  (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json('Deletion Successful');
      } else {
        res.status(401).json('Not deleted');
      }
    });
});

module.exports = router;