const express = require("express");
const router = express.Router();

const { getUsers } = require("../controllers/alluser");

router.get("/alluser", getUsers);

module.exports = router;
