const express = require("express");
const router = express.Router();
const { insertTicket, getTickets, getTicketById, updateClientReply, updateStatusClose, deleteTicket } = require("../model/ticket/Ticket.model");
const { userAuthorization } = require("../middlewares/authorization.middleware")


const { createNewticketValidation, replyTicketMessageValidation } = require('../middlewares/formValidation.middleware');
const { getUserById } = require("../model/user/User.model");



router.all("/", (req, res, next) => {
    //res.json({ message: "return form ticket router" })
    next();
});

//1. Create new ticket
router.post("/", createNewticketValidation, userAuthorization, async(req, res) => {
    try {
        //2. receive new ticket data
        const { subject, sender, message } = req.body;
        const userId = req.userId
        const ticketObj = {
            clientId: userId,
            subject,
            conversations: [{
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


//. Retireve all the ticket for the specific user
router.get("/", userAuthorization, async(req, res) => {
    try {

        //. Authorize every request with jwt
        const userId = req.userId
        const result = await getTickets(userId);
        return res.json({
            status: "success",
            result
        });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});


//. Retireve all the ticket for the specific user
router.get("/:_id", userAuthorization, async(req, res) => {
    console.log(req.params)
    try {

        const { _id } = req.params
            //. Authorize every request with jwt
        const clientId = req.userId
        const result = await getTicketById(_id, clientId);
        return res.json({
            status: "success",
            result
        });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

//. Update reply message from client
router.put("/:_id", replyTicketMessageValidation, userAuthorization, async(req, res) => {

    try {

        const { message, sender } = req.body
        const { _id } = req.params

        const result = await updateClientReply(_id, message, sender);

        if (result._id) {
            return res.json({
                status: "success",
                message: "Updated message"
            });
        }
        res.json({
            error: "error",
            message: "Unable to update message. Please try again"
        });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});


// update ticket status and close operator responsive pending, client response pending
router.patch("/close-ticket/:_id", userAuthorization, async(req, res) => {

    try {


        const { _id } = req.params
        const clientId = req.userid
        const result = await updateStatusClose(_id, clientId);

        if (result._id) {
            return res.json({
                status: "success",
                message: "The ticket has been closed"
            });
        }
        res.json({
            error: "error",
            message: "Unable to update message. Please try again"
        });
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});

// delete ticket from mongodb
router.delete("/:_id", userAuthorization, async(req, res) => {

    try {


        const { _id } = req.params
        const clientId = req.userid
        const result = await deleteTicket(_id, clientId);


        return res.json({
            status: "success",
            message: "The ticket has been deleted"
        });


    } catch (error) {
        res.json({ status: "error", message: error.message });
    }
});


module.exports = router;