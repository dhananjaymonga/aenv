const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../modules/listing.js"); 
 require("../server.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/adim";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({})
  initData.data=initData.data.map((obj)=>({...obj,owner:"67cf29af04fc89a44387a13f"}))
  // .then(() => {            
  //   console.log("data was deleted");
  // });       
  await Listing.insertMany(initData.data).then(() => {         
    console.log("data was inserted");
  });
}

initDB();