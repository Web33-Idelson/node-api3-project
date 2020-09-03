const express = require('express');
const postDb = require('./postDb');

const router = express.Router();

router.get('/', (req, res) => {
  // do your magic!
  postDb.get()
  .then(posts => {
    res.status(200).json(posts)
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Error performing the requested operation" })
  })
});

router.get('/:id', validatePostId, (req, res) => {
  // do your magic!
  const postId = req.params.postId

  postDb.getById(postId)
  .then(post =>{
    res.status(200).json(post)
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Error performing the requested operation" })
  })
});

router.delete('/:id', validatePostId, (req, res) => {
  // do your magic!
  const postId = req.params.id

  postDb.remove(postId)
  .then(deletedPost => {
    res.status(202).json(deletedPost)
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Error performing the requested operation" })
  })
});

router.put('/:id', validatePost, (req, res) => {
  // do your magic!
  const postId = req.params.id
  const update = req.body

  postDb.update(postId, update)
  .then(updatedPost => {
    res.status(200).json(updatedPost)
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Error performing the requested operation" })
  })
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  const postId = req.params.id
  
  postDb.getById(postId)
  .then(post => {
    if(post){
      req.postId = post
      next()
    } else{
      res.status(400).json({ message: "invalid post id"})
    }
  })
  .catch(err => {
    res.status(500).json({ error: "There was an error processing your request"})
  })
}

function validatePost(req, res, next) {
  const body = req.body
  const text = req.body.text

  if(!body){
    res.status(400).json({ message: "missing post data"})
  } else if (!text){
    res.status(400).json({ message: "missing required text field"})
  } else {
    next()
  }
}

module.exports = router;
