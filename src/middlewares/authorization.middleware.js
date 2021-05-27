const { verfiyAccessJWT } = require("../helpers/jwt.helper");
const { getJWT, deleteJWT } = require("../helpers/redis.helper");

const userAuthorization = async(req, res, next) => {
    const { authorization } = req.headers;
    console.log(authorization);
    //1. verify if jwt is valid
    const decoded = await verfiyAccessJWT(authorization);

    if (decoded.email) {
        const userId = await getJWT(authorization);
        console.log(userId);
        if (!userId) {
            return res.status(403).json({ message: "Forbidden" });
        }

        req.userId = userId;
        return next();
    }
    //delete old token from redis db
    deleteJWT(authorization);

    res.status(403).json({ message: "Forbidden" });
};

module.exports = {
    userAuthorization,
};