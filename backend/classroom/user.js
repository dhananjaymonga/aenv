const express=require("express");
const router=express.Router()
router.get("/",(req,res)=>{
    res.send("Hello World");
}); 
router.get("/users", (req, res) => {
    res.send("All Listings");
});
router.post("/user/:id", (req, res) => {
    res.send("Get for user");
});
router.post("/user/:id", (req, res) => {
    res.send("post for user");
});
module.exports=router;