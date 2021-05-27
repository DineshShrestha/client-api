const { verfiyAccessJWT } = require('../helpers/jwt.helper')
const { getJWT } = require("../helpers/redis.helper")

const userAuthorization = async(req, res, next) => {
    const { authorization } = req.headers
    console.log(authorization)
        //1. verify if jwt is valid
    const decoded = await verfiyAccessJWT(authorization)

    if (decoded.email) {
        const userId = await getJWT(authorization)
        console.log(userId)
        if (!userId) {
            return res.status(403).json({ message: "Forbidden" })
        }

        req.userId = userId
        return next()
    }



    res.status(403).json({ message: "Forbidden" })

}

module.exports = {
    userAuthorization,
}