const express = require('express');
const db = require('./userDb');
const postDb = require('../posts/postDb');
const router = express.Router();

router.post('/', validateUser (req, res) => {
  // do your magic!
  db.insert(req.body)
  .then(newUser => {
    res.status(201).json({ message: "User was created successfully"})
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "error performing the reqested operation"})
  })
});

router.post('/:id/posts', validatePost (req, res) => {
  // do your magic!
  const user_id = req.params.id;
  const {text} = req.body
  postDb.insert({user_id, text})
  .then(newPost => {
    res.status(201).json({ message: "Post was created successfully "})
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Error performing the requested operation" })
  })
});

router.get('/', (req, res) => {
  // do your magic!
  db.get()
  .then(users => {
    res.status(200).json(users)
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Error performing the requested operation"})
  })
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  const user_id = req.params.id
  db.getById(user_id)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Error performing the requested operation"})
  }) 
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  const user_id = req.params.id
  db.getUserPosts(user_id)
  .then(userPosts => {
    res.status(200).json(userPosts)
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Error performing the requested operation" })
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  const user_id = req.params.id

  db.remove(user_id)
  .then(deletedUser => {
    res.status(202).json(deletedUser)
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Error performing the requested operation" })
  })
});

router.put('/:id', validateUser, validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id
  const update = req.body

  db.update(id, update)
  .then(updatedUser => {
    res.status(200).json(updatedUser)
  })
  .catch(err => {
    res.status(500).json({ errorMessage: "Error performing the requested operation" })
  })
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const {id} = req.params
  db.getById(id)
  .then(user => {
    if(user){
      req.user = user
      next()
    } else {
      res.status(400).json({ message: "invalid user id" })
    }
    .catch(err => {
      res.status(500).json({ error: "There was an error processing your request"})
    })
  })
}

function validateUser(req, res, next) {
  // do your magic!
  const body = req.body
  const name = req.body.name 

  if(!body){
    res.status(400).json({ message: "Missing user data" })
  } else if (!name){
    res.status(400).json({ message: "Missing required name field" })
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  // do your magic!
  const body = req.body
  const text = req.body.text

  if(!body){
    res.status(400).json({ message: "Missing post data" })
  } else if(!text){
    res.status(400).json({ message: "Missing required text field" })
  } else{
    next()
  }
}

module.exports = router;
