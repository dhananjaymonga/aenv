const express= require("express")
const app=express()
const mongoose=require("mongoose")
const Listing=require("../backend/modules/listing")
const initData=require("./init/data")
const Port =5000;
const MONGO_URI="mongodb://localhost:27017/adim"
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
app.get("/testListing", async (req,res)=>{
//     let Listingdata= new Listing({
// tittle:"My name",
// description:"honeymoon",
// price:2000,
// location:"ireland",
// country:"uk"    
//     })
await Listing.insertMany(initData.data);

    // await Listing.save()
    console.log("sample was saved")
    res.send("hi")
})

app.listen(Port,()=>{
    console.log(`started ${Port}`)
})