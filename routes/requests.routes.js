const router = require("express").Router()
const auth = require("../middleware/auth.js")
const requestController = require("../controller/request.controller");

router.get("/userRequests", auth("User"), requestController.showAllRequests)
router.post("/newRequest", auth("User"), requestController.newRequest)
router.patch("/requestAnswer/:id", auth("User"), requestController.requestAnswer)

module.exports = router