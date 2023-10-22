// Create web server using express
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const fs = require("fs");

// Read file
const commentPath = path.join(__dirname, "comments.json");
let comments = JSON.parse(fs.readFileSync(commentPath));

// Use middleware to parse request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// GET request
app.get("/api/comments", (req, res) => {
  res.json(comments);
});

// POST request
app.post("/api/comments", (req, res) => {
  // Add new comment to comments
  comments.push(req.body);
  // Write comments to file
  fs.writeFileSync(commentPath, JSON.stringify(comments));
  // Send response
  res.status(201).json(comments);
});

// DELETE request
app.delete("/api/comments/:id", (req, res) => {
  // Get comment id from request params
  const commentId = req.params.id;
  // Find comment with commentId
  const comment = comments.find((comment) => comment.id === commentId);
  if (!comment) {
    res.status(404).json({ message: `Comment with id ${commentId} not found!` });
  } else {
    // Delete comment
    comments = comments.filter((comment) => comment.id !== commentId);
    // Write comments to file
    fs.writeFileSync(commentPath, JSON.stringify(comments));
    // Send response
    res.status(200).json(comments);
  }
});

// PUT request
app.put("/api/comments/:id", (req, res) => {
  // Get comment id from request params
  const commentId = req.params.id;
  // Find comment with commentId
  const comment = comments.find((comment) => comment.id === commentId);
  if (!comment) {
    res.status(404).json({ message: `Comment with id ${commentId} not found!` });
  } else {
    // Update comment
    comment.content = req.body.content;
    // Write comments to file
    fs.writeFileSync(commentPath, JSON.stringify(comments));
    // Send response
    res.status(200).json(comments);
  }
});

// Listen on port 3000
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});