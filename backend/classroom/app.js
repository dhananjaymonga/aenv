const express =require("express");
const app = express();
const user=require("./user")
const post=require("./posts")
const cookieParser=require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");
const { name } = require("ejs");
require("dotenv").config(); 

// require("dotenv").config

// console.log("URL:", process.env.URL); // ✅ Should print "HTNB"

console.log(process.env.URL)
const multer = require("multer");
const { storage } = require("../cloudConfig"); 

// const {storage} = require("./cloudConfig")
// const upload = multer({ storage }); // ✅ Cloudinary/S3 ke liye sahi tareeka

app.use(flash());
app.use(session({ secret:"dhananjay", resave:false, saveUninitialized:true}));
app.set("view engine", "ejs");
// app.engine("ejs", engine);
app.set("views", path.join(__dirname, "views"));
// app.get("/setcookies", (req, res) => {
//     res.cookie("name", "express");
//     res.cookie("teacher", "harsh");
//     res.send("Cookies have been set");
// });
// app.get("/setsignedcookies", (req, res) => {
//     res.cookie("name", "harsh",{signed:true});
//     res.cookie("name", "dhananjay",{signed:true});
//     res.send("Cookies  set");
// });
// app.get("/getcookies", (req, res) => {
//     const {name="harsh"}=req.cookies; 
//     console.log(req.cookies); // Print cookies in terminal
//     res.send(name); // Send cookies as response
// });
app.use((req,res,next)=>{
    res.locals.msg=req.flash("sucess");
    res.locals.err=req.flash("error");
    next()
})
app.get("/verifycookies", (req, res) => {
    if(req.session.count){
        req.session.count++;
    }
    else{
        req.session.count=1;
    }   
    // console.log(req.signedCookies);
    res.send(`Count is ${req.session.count}`);
})

// session set
app.get("/get",(req,res)=>{
    const {name="harsh"}=req.query;
    req.session.name=name;
    if(name==="harsh"){
        req.flash("error","Name is not set");
    }
    else{
    // res.send(name)
req.flash("sucess","Successfully set the name");
    res.redirect("/wet");}
})
app.get("/wet",(req,res)=>{
    res.render("flash",{name:req.session.name});
    // res.send(`name ${req.session.name}`);
})
app.use("/user",user);
app.use("/post",post);
app.get("/new",(req,res)=>{
    res.render("new.ejs")
})
const { upload } = require("../cloudConfig"); // ✅ Import properly

app.post("/listings", upload.single("image"), (req, res) => {
    // console.log(req.file); // ✅ Check Cloudinary URL
    // if (!req.file || !req.file.path) {
    //     return res.status(400).send("File upload failed!");
    // }
    // res.send({ imageUrl: req.file.path }); // ✅ Send Cloudinary URL as response
    console.log("Uploaded File:", req.file); // ✅ Debugging ke liye

res.send(req.file)
});
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});