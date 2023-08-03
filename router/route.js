const express = require("express");
const router=express.Router();
const functi = require("../function/function")

router.post('/signup',functi.signUp);
router.post('/users',functi.signIn);
router.get('/alluser',functi.getall);


module.exports = router;
