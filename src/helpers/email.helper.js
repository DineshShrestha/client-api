const nodemailer = require('nodemailer')




const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'giovanny.hyatt@ethereal.email',
        pass: 'pq9xxAu9JtDJYxYdZ1'
    }
});
const send = (info) => {
    return new Promise(async(resolve, reject) => {
        try {
            // send mail with defined transport object
            let result = await transporter.sendMail(info);

            console.log("Message sent: %s", result.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            resolve(result)
        } catch (error) {
            console.log(error)
        }
    })


}


const emailProcessor = ({ email, pin, type }) => {
    let info
    switch (type) {
        case "request-new-password":
            info = {
                from: '"CRM Company" <giovanny.hyatt@ethereal.email>', // sender address
                to: email, // list of receivers
                subject: "reset pin", // Subject line
                text: "here is your password reset pin" + pin + "this pin will expire in one day", // plain text body
                html: `<b>Hello world?</b>
            Here is your pin
                <b>${pin}</b>
    
            `, // html body
            }

            send(info)
            break;
        case "update-password-success":
            info = {
                from: '"CRM Company" <giovanny.hyatt@ethereal.email>', // sender address
                to: email, // list of receivers
                subject: "password updated", // Subject line
                text: "Your new password has been updated.", // plain text body
                html: `<b>Password updated</b>
            Your password has been updated`, // html body
            }
            send(info)
            break;

        default:
            break;
    }

}

module.exports = {
    emailProcessor
}