const express =require("express");
const app = express();
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});
app.get("/",(req,res)=>{
    res.send("Hello World");
}); 
app.get("/users", (req, res) => {
    res.send("All Listings");
});
app.get("/user/:id", (req, res) => {
    res.send("Get for user");
}); 
app.post("/user/:id", (req, res) => {
    res.send("post for user");
}); 