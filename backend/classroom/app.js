const express =require("express");
const app = express();
const user=require("./user")
const post=require("./posts")

app.use("/user",user);
app.use("/post",post);
app.get("/",(req,res)=>{
    res.send("Hello World");
}); 
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});