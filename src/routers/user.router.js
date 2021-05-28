const express = require("express");
const { route } = require("./ticket.router")
const router = express.Router();
const { insertUser, getUserByEmail, getUserById, updatePassword, storeUserRefreshJWT } = require('../model/user/User.model')
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper")
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper")
const { userAuthorization } = require('../middlewares/authorization.middleware')
const { setPasswordResetPin, getPinByEmailPin, deletePin } = require('../model/resetPin/ResetPin.model');
const { emailProcessor } = require("../helpers/email.helper");

const { resetPassReqValidation, updatePassReqValidation } = require("../middlewares/formValidation.middleware")
const { deleteJWT } = require("../helpers/redis.helper")

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
router.post("/reset-password", resetPassReqValidation, async(req, res) => {
    const { email } = req.body
    const user = await getUserByEmail(email)
    if (user && user._id) {
        /// create unique 6 digit pin
        const setPin = await setPasswordResetPin(email)

        await emailProcessor({ email, pin: setPin.pin, type: "request-new-password" })

        return res.json({ status: "success", message: "If the email exists in our database the password reset pin will be sent shortly." })

    }
    res.json({ status: "error", message: "If the email exists in our database the password reset pin will be sent shortly." })
})

//C. Server side form validation
//1. Create middlewarae to validate form db

router.patch("/reset-password", updatePassReqValidation, async(req, res) => {
    //1.receive email, pin and new password
    const { email, pin, newPassword } = req.body
    const getPin = await getPinByEmailPin(email, pin)
        //2. validate pin
    if (getPin._id) {
        const dbDate = getPin.addedAt
        const expiresIn = 1
        let expDate = dbDate.setDate(dbDate.getDate() + expiresIn)
        const today = new Date()

        if (today > expDate) {
            return res.json({ status: "error", message: "Invalid or expired pin." })
        }

        //3. encrypt new password
        const hashedPass = await hashPassword(newPassword)
        const user = await updatePassword(email, hashedPass)

        if (user._id) {

            //5. send email notification
            await emailProcessor({ email, type: "update-password-success" })

            //6. delete pin from db
            deletePin(email, pin)

            return res.json({ status: "success", message: "Your password has been updated" })


        }
    }
    res.json({ status: 'error', message: "unable to update your password. Please try again" })
})

//user logout and invalidate jwts
//1. get jwt and verify

//3. delete refreshJWT from mongodb

router.delete("/logout", userAuthorization, async(req, res) => {
    const { authorization } = req.headers
    const _id = req.userId


    //2. delete accessJWT from redis database
    deleteJWT(authorization)

    //3. delete refreshJWT from mongodb
    const result = await storeUserRefreshJWT(_id, '')
    if (result._id) {
        return res.json({ status: 'success', message: "logged out successfully" })
    }
    res.json({ status: 'error', message: "unable to logout.Please try again later" })
})

module.exports = router;