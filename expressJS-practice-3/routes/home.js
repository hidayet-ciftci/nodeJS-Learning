const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  /* console.log("hello from second middleware"); */
  res.send("<h1>Hello From Home Pagess</h1>");
});

// router.use('/',(req,res,next)=>{                         router.use ile /adasdasd her
//    /* console.log("hello from second middleware"); */    türlü linke girebiliriz her
//    res.send("<h1>Hello From Home Page</h1>");            method kullanılabilir ama router.get
// })                                                       sadece o linkte ve sadece get methodu ile çalışır.

module.exports = router;
