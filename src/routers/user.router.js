const express = require("express");
const { route } = require("./ticket.router")
const router = express.Router();
const { insertUser, getUserByEmail, getUserById } = require('../model/user/User.model')
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper")
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper")
const { userAuthorization } = require('../middlewares/authorization.middleware')
const { setPasswordResetPin } = require('../model/resetPin/ResetPin.model')
router.all('/', (req, res, next) => {
    //res.json({ message: "return form user router" })
    next()
});
//Get user profile router
router.get("/", userAuthorization, async(req, res) => {
        //this is coming from database
        //2. check if jwt exist in redis
        const _id = req.userId

        const userprof = await getUserById(_id)
            //3. extract user id
            //4. get user profile based on the user id
        res.json({ user: userprof })
    })
    //Create new user route
router.post("/", async(req, res) => {
    const { name, company, address, phone, email, password } = req.body
    try {
        //hash password
        const hashedPass = await hashPassword(password)

        const newUserobj = {
            name,
            company,
            address,
            phone,
            email,
            password: hashedPass,
        }
        const result = await insertUser(newUserobj)
        console.log(result)
        res.json({ message: "new user created", result })
    } catch (error) {
        console.log(error)
        res.json({ status: "error", message: error.message })
    }


})

//User sign in router
router.post("/login", async(req, res) => {
    console.log(req.body)
    const { email, password } = req.body


    if (!email || !password) {
        return res.json({ status: "error", message: "Invalid form submission" })
    }
    ///get user with email from db

    const user = await getUserByEmail(email)
    const passFromDb = user && user._id ? user.password : null

    if (!passFromDb) return res.json({ status: "error", message: "Invalid email or password" })

    const result = await comparePassword(password, passFromDb)

    if (!result) {
        return res.json({ status: "error", message: "Invalid email or password" })
    }

    const accessJWT = await createAccessJWT(user.email, `${user._id}`)
    const refreshJWT = await createRefreshJWT(user.email, `${user._id}`)
    res.json({ status: "success", message: "Login Successfully!!", accessJWT, refreshJWT })
})

// A. Create and send password reset pin number
//1. receive email
//2. Check if user extist for the email
//3. create unique 6 digit pin
//4. save pin and email in database
//5. send email notification
//B. Update password in DB
//1.receive email, pin and new password
//2. validate pin
//3. encrypt new password
//4.update password in db
//5. send email notification

//C. Server side form validation
//1. Create middlewarae to validate form data. 
router.post("/reset-password", async(req, res) => {
    const { email } = req.body
    const user = await getUserByEmail(email)
    if (user && user._id) {
        /// create unique 6 digit pin
        const setPin = await setPasswordResetPin(email)
        return res.json(setPin)

    }
    res.json({ status: "error", message: "If the email exists in our database the password reset pin will be sent shortly." })
})

module.exports = router;