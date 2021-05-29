const express = require("express");
const router = express.Router();
const { insertTicket } = require("../model/ticket/Ticket.model");
//workflow

//3. Authorize every request with jwt
//5. Retireve all the ticket for the specific user
//6. Update message conversation in the ticket database
//6. update ticket status and close operator responsive pending, client response pending
//7. delete ticket from mongodb

router.all("/", (req, res, next) => {
    //res.json({ message: "return form ticket router" })
    next();
});

//1. Create url endpoints
router.post("/", async(req, res) => {
    try {
        //2. receive new ticket data
        const { subject, sender, message } = req.body;

        const ticketObj = {
            clientId: "60aeaedde8e4af39fc1d77b5",
            subject,
            converstations: [{
                sender,
                message,
            }, ],
        };
        //4. Insert in mongodb
        const result = await insertTicket(ticketObj);

        if (result._id) {
            return res.json({
                status: "success",
                message: "New ticket has been cread",
            });
        }
        res.json({
            status: "error",
            message: "Unable to create new ticket. Please try again later",
        });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});



module.exports = router;