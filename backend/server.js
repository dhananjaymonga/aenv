const express= require("express")
const app=express()
const mongoose=require("mongoose")
const Listing=require("../backend/modules/listing")
const initData=require("./init/data")
const Port =5000;
const MONGO_URI="mongodb://localhost:27017/adim"
const path = require("path")
const methodOverride = require("method-override");
const engine = require("ejs-mate");
app.set("view engine", "ejs")
app.engine("ejs", engine);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }));    
app.use(express.json()) 
app.use(methodOverride("_method"));
main().then(()=>{
    console.log("connected")
}).catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(MONGO_URI)
}
app.get("/",(req,res)=>{
    res.send("hi")
})
// app.get("/testListing", async (req,res)=>{
//     const newListing = new Listing({
//         title: "Luxury Villa",
//         description: "A beautiful luxury villa with ocean view.",
//         image: {
//             filename: "villa123.jpg",  
//             url: "https://example.com/villa123.jpg"  
//         },
//         price: 7000,
//         location: "Maldives",
//         country: "Maldives"
//     });
//     await
// // await Listing.insertMany(initData.data);
// // await Listing.insertOne(Listingdata);
//     await newListing.save().then((data)=>{
//         console.log(data)
//     }).catch((err)=>{
//         console.log(err)
//     })
//     console.log(newListing)
//     console.log("sample was saved")
//     res.send("hi")
// })
app.get("/listings", async (req,res)=>{
    const allListings= await Listing.find({})
    // res.send(listings)
    res.render("listings/index", { allListings });
}
)
app.get("/listings/new", async (req,res)=>{
    res.render("listings/new")
 }
 )
app.get("/listings/:id", async (req,res)=>{
    const {id}=req.params
    // res.send(id)
    const show = await Listing.findById(id);
    res.render("listings/show", { listing:show });
    // res.render("listings/index", { allListings });
}
)
// create routes
app.post("/listings", async (req, res) => {
    try {
        let newListing = req.body.listing;

        if (!newListing.image) {
            newListing.image = { url: "", filename: "" };
        }

        // If URL is provided, generate filename
        if (newListing.image.url) {
            newListing.image.filename = newListing.image.url.split('/').pop();
        } else {
            newListing.image.filename = "default.jpg"; // Set a default filename
            newListing.image.url = "https://via.placeholder.com/300"; // Set a default image URL
        }

        const listing = new Listing(newListing);
        await listing.save();

        console.log("New Listing Created:", listing);
        res.redirect("/listings"); // Redirect to listings page after creation
    } catch (err) {
        console.error("Error creating listing:", err);
        res.status(400).send("Failed to create listing");
    }
});
// edit Routes

app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
res.render("listings/edit.ejs", { listing});
})

// update Routes

app.put("/listings/:id", async (req, res) => {
    const {id}=req.params

   await Listing.findByIdAndUpdate(id,{...req.body.listing})
   res.redirect(`/listings/${id}`)
})      
// delete Routes
app.delete("/listings/:id", async (req, res) => {
    const {id}=req.params

   const deletedlisting=await Listing.findByIdAndDelete(id)
   console.log(deletedlisting)
   res.redirect("/listings")
})      


app.listen(Port,()=>{
    console.log(`started ${Port}`)
})