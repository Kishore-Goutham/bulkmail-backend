const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const nodemailer = require("nodemailer");

const PORT = process.env.PORT || 5000;
mongoose.connect("mongodb+srv://kishoregoutham00_db_user:Mongo1234@cluster0.gjk5tsd.mongodb.net/passkey?appName=Cluster0").then(()=> console.log("db started")).catch((err)=>console.log(err))

const credential = mongoose.model('Credential',{},'bulkmail');


const app = express();
app.use(cors())
app.use(express.json());


app.post("/sendemail", async (req,res)=>{
  let {email,emaillist,subject} = req.body
  console.log(email,emaillist,subject)

 try{
  let creds = await credential.find();
  console.log(creds)
  const transporter = nodemailer.createTransport({
   service:"gmail",
  auth: {
    user: creds[0].toJSON().user,
    pass: creds[0].toJSON().pass,
  },
});

  for(const data of emaillist){
    console.log(data)
   await transporter.sendMail({
    from: creds[0].toJSON().user,
    to: data,
    subject: subject,
    text: email
  });
}
  res.status(200).send("success")
}catch(err){
  console.log(err)
  res.status(400).send(err)
}


})

app.get("/", (req, res) => {
  res.send("Backend is running");
});
  

app.listen(PORT,()=>{
    console.log("server started")
})
