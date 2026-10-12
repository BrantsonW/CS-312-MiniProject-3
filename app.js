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
app.get("/", async (req, res) => {
    let currentUser = null;

    if (req.session.userId) {currentUser = {id: req.session.userId, name: req.session.userName};}

    res.render("index", {posts: posts, currentUser: currentUser});
});

//CREATING NEW BLOG POSTS
app.post("/posts", async (req, res) => {
    //verify signed in status
    if (!req.session.userId) {
        return res.redirect("/signin");
    }

    //form var declarations
    const title = req.body.title;
    const content = req.body.content;

    //verify title and content exist
    if (!title?.trim() || !content?.trim()){
        return res.status(400).send("A TITLE and CONTENT are required.");
    }

    try {
        await db.query(
            'INSERT INTO blogs (creator_name, creator_user_id, title, body) VALUES ($1, $2, $3, $4)',
            [
                req.session.userName,
                req.session.userId,
                title,
                content
            ]
        );
        red.redirect("/");
    }

    catch(error){
        console.error(error);
        res.status(500).send("Error creating post.")
    }

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

//SIGNUP PAGE
app.get("/signup", (req, res) => {
    res.render("signup", { error: null });
});

//CREATING NEW USER ACCOUNTS
app.post("/signup", async (req, res) => {
    const { user_id, name, password } = req.body;

    if (!user_id?.trim() || !name?.trim() || !password) {
        return res.render("signup", {
            error: "All fields are required."
        });
    }

    try {
        //Check if username already exists
        const existingUser = await db.query(
            "SELECT user_id FROM users WHERE user_id = $1",
            [user_id]
        );

        if (existingUser.rows.length > 0) {
            return res.render("signup", {
                error: "Username already taken."
            });
        }

        //Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        //Add user to the database
        await db.query(
            "INSERT INTO users (user_id, password, name) VALUES ($1, $2, $3)",
            [user_id, hashedPassword, name]
        );

        res.redirect("/signin");
    }
    catch (error) {
        console.error(error);

        res.status(500).render("signup", {
            error: "Could not create account."
        });
    }
});

//SIGNIN PAGE
app.get("/signin", (req, res) => {
    res.render("signin", { error: null });
});

//SIGNING INTO EXISTING ACCOUNT
app.post("/signin", async (req, res) => {
    const { user_id, password } = req.body;

    try {
        //Find user by username
        const result = await db.query(
            "SELECT * FROM users WHERE user_id = $1",
            [user_id]
        );

        const user = result.rows[0];

        if (!user) {
            return res.render("signin", {
                error: "Incorrect username or password."
            });
        }

        //Compare password with stored hash
        const passwordMatches = await bcrypt.compare(
            password || "",
            user.password
        );

        if (!passwordMatches) {
            return res.render("signin", {
                error: "Incorrect username or password."
            });
        }

        //Regenerate session after successful login
        req.session.regenerate((error) => {
            if (error) {
                console.error(error);
                return res.status(500).send("Session error.");
            }

            req.session.userId = user.user_id;
            req.session.userName = user.name;

            req.session.save((error) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send("Session error.");
                }

                res.redirect("/");
            });
        });
    }
    catch (error) {
        console.error(error);

        res.status(500).render("signin", {
            error: "Error: Something went wrong."
        });
    }
});

//SIGN OUT
app.post("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error(error);
            return res.status(500).send("Unable to sign out.");
        }

        res.clearCookie("connect.sid");
        res.redirect("/signin");
    });
});

//START SERVER
app.listen(PORT, () => {});