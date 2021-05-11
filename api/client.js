const express = require("express");
const router = express.Router();




router.get("/test", async (req, res) => {
    return res.status(200).send({"id": "samuel2"});
});

module.exports = (app) => app.use("/api/client", router);