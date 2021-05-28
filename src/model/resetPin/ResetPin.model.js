const { ResetPinSchema } = require("./ResetPin.schema")
const { randonPinNumber } = require("../../utils/randomGenerator")

const setPasswordResetPin = async(email) => {

    //resend 6 digit pin
    const pinLength = 6
    const randPin = await randonPinNumber(pinLength)
    const resetObj = {
        email,
        pin: randPin
    }
    return new Promise((resolve, reject) => {
        ResetPinSchema(resetObj).save()
            .then(data => resolve(data))
            .then(error => reject(error))
    })

}


module.exports = {
    setPasswordResetPin,

}