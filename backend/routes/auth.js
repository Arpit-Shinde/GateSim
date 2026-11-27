const express = require("express")
const router = express.Router()
const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body //extract 

        if (!username) return res.json({ error: "Username cannot be empty" })
        if (!email || !password) return res.json({ error: "Email/Password cannot be empty" })

        const hash = await bcrypt.hash(password, 10)

        const user = await User.findOne({ username: username, email: email });
        if (user) return res.json({ status: "User Already Exists. Log In instead" })
        let newUser = new User({ //create the object
            username: username,
            email: email,
            password: hash
        })

        let savedUser = await newUser.save() //save it in database. we are using await, because this task might take time

        const token = jwt.sign({ userId: savedUser._id, username: savedUser.username }, process.env.JWT_SECRET, { expiresIn: "7d" })

        console.log("user saved")
        return res.json({ status: "Account Created Successfully", token: token })
    }
    catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0]; // "username" or "email"
            const message =
                field === "username"
                    ? "Username is already taken"
                    : "An account with this email already exists";

            return res.json({ field, error: message });
        }

        return res.json({ status: "Something went wrong in database. Please try again" })
    }

})
router.get("/username", async (req, res) => {
    const user = await User.findById(req.header.userId);
    return res.json({ username: user.username });
})
router.post("/login", async (req, res) => {
    try {
        // Extract exactly what Postman sends. the "email", "password" (on lhs), etc must match to the keys in postman request body
        const { username, email, password } = req.body

        if (!username) return res.json({ error: "Username cannot be empty" })
        if (!email || !password) return res.json({ error: "Email/Password cannot be empty" })

        // Search using the username variable
        const user = await User.findOne({ username: username, email: email });

        if (!user) {
            console.log("Invalid login credentials");
            return res.json({ error: "Invalid login credentials" })
        }
        // Compare plain password against the bcrypt hash in MongoDB
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log("Invalid login credentials");
            return res.json({ error: "Invalid login credentials" })
        }

        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" })

        console.log(`Welcome ${user.username}`)
        return res.json({
            status: `Logged In Successfully`,
            token: token,
            userName: user.username
        })
    }
    catch(error){
        console.log(error);
        return res.json({error: "Some error occured. Please try again"});
    }
    
});
module.exports = router