const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const db = require("./db");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax"
    }
}));

let posts = [];
let nextId = 1;

//HOMEPAGE
app.get("/", (req, res) => {
    res.render("index", { posts: posts });
});

//CREATING NEW BLOG POSTS
app.post("/posts", (req, res) => {
    //form information
    const author = req.body.author;
    const title = req.body.title;
    const content = req.body.content;

    //new post object
    const newPost = {
        id: nextId,
        author: author,
        title: title,
        content: content,
        createdAt: new Date()
    };

    //increment to the next id
    nextId++;

    //add the new post
    posts.push(newPost);

    res.redirect("/");
});

//EDITING BLOG POSTS
app.get("/posts/:id/edit", (req, res) => {
    //get the id from the url
    const id = Number(req.params.id);

    //find the post with id
    const post = posts.find(post => post.id === id);

    //render that post on the edit page
    res.render("edit", { post: post });
});

//SAVING EDITTED BLOG POSTS
app.post("/posts/:id/edit", (req, res) => {
    //get the id from the url
    const id = Number(req.params.id);

    //find the post with id
    const post = posts.find(post => post.id === id);

    //update the post info
    post.author = req.body.author;
    post.title = req.body.title;
    post.content = req.body.content;

    //send back to home
    res.redirect("/");
});

//DELETING BLOG POSTS
app.post("/posts/:id/delete", (req, res) => {
    //get the id from url
    const id = Number(req.params.id);

    //keep all posts but deleted one
    posts = posts.filter(post => post.id !== id);

    //send back to home
    res.redirect("/");
});

//START SERVER
app.listen(PORT, () => {});