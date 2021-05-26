const { UserSchema } = require("./User.schema")


const insertUser = userObj => {
    return new Promise((resolve, reject) => {
        UserSchema(userObj).save()
            .then(data => resolve(data))
            .then(error => reject(error))
    })

}

module.exports = {
    insertUser
}