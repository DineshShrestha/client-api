const jwt = require('jsonwebtoken');
const { getJWT, setJWT } = require('../helpers/redis.helper')

const { storeUserRefreshJWT } = require("../model/user/User.model")
const createAccessJWT = async(email, _id) => {
    try {
        const accessJWT = await jwt.sign({ email },
            process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' })
        await setJWT(accessJWT, _id)
        return Promise.resolve(accessJWT)
    } catch (error) {
        return Promise.reject(error)
    }
}


const createRefreshJWT = async(email, _id) => {
    try {
        const refreshJWT = await jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })

        await storeUserRefreshJWT(_id, refreshJWT)
        return Promise.resolve(refreshJWT)
    } catch (error) {
        return Promise.reject(error)
    }


}

const verfiyAccessJWT = userJWT => {
    try {
        return Promise.resolve(jwt.verify(userJWT, process.env.JWT_ACCESS_SECRET))
    } catch (error) {
        return Promise.resolve(error)
    }
}


const verfiyRefreshJWT = userJWT => {
    try {
        return Promise.resolve(jwt.verify(userJWT, process.env.JWT_REFRESH_SECRET))
    } catch (error) {
        return Promise.resolve(error)
    }
}

module.exports = {
    createAccessJWT,
    createRefreshJWT,
    verfiyAccessJWT,
    verfiyRefreshJWT
}