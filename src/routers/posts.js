const express = require('express')
const db = require('../data/db')
const router = express.Router()

// GET: gets posts
router.get('/', async (req, res) => {
  try {
    res.status(200).json(await db.find())
  } catch(err) {
    console.error(err)
    res.status(500).json({ error: "The posts information could not be retrieved." })
  }
})

// GET: gets a post by its id
router.get('/:id', async (req, res) => {
  try{
    const result = await db.findById(req.params.id)
    if(result.length) {
      res.status(200).json(result[0])
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
  } catch(err) {
    console.error(err)
    res.status(500).json({ error: "The post information could not be retrieved." })
  }
})

// GET: gets a post comment by its ID
router.get('/:id/comments', async (req, res) => {
  try{
    const commentId = req.params.id
    const comment = await db.findCommentById(commentId)
    if(comment.length) {
      res.status(200).json(comment)
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
  } catch(err) {
    console.error(err)
    res.status(500).json({ error: "The comments information could not be retrieved." })
  }
})

// POST: ads a new post
router.post('/', async (req, res) => {
  try {
    const { title, contents } = req.body
    if(!title || !contents) {
      res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    await db.insert(req.body)
    res.status(201).json({ success: "New post created" })
  } catch(err) {
    console.error("Error: \n", err)
    res.status(500).json({ error: "There was an error while saving the post to the database" })
  }
})

// POST: adds a comment to a post
router.post('/:id/comments', async (req, res) => {
  try {
    const postId = req.params.id
    const postForComment = await db.findById(postId)
    const { text } = req.body
    const newComment = {text: text, post_id: postId}

    if(!text) {
      res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } else {
      if(postForComment.length) {
        await db.insertComment(newComment)
        res.status(201).json({ success: "New comment created" })
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    }

  } catch(err) {
    console.error(err)
    res.status(500).json({ error: "There was an error while saving the comment to the database" })
  }
})

// DELETE: deletes a post based on ID
router.delete('/:id', async (req, res) => {
  try {
    const rowsDeleted = await db.remove(req.params.id)
    if(rowsDeleted) {
      res.status(200).json({ success: "Post deleted" })
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
  } catch(err) {
    console.error("== Error ==\n", err)
    res.status(500).json({ error: "The post could not be removed" })
  }
})

// PUT: updates a post by id
router.put('/:id', async (req, res) => {
  try {
    const { title, contents } = req.body
    const postId = req.params.id
    const postToEdit = await db.findById(postId)
    const editedPost = {
      ...postToEdit[0],
      title,
      contents
    }

    if(postToEdit.length) {
      if(!title || !contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
      } else {
        await db.update(postId, editedPost)
        res.status(200).json(editedPost)
      }
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "The post information could not be modified." })
  }
})

module.exports = router