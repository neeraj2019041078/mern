require('dotenv').config()
const express=require("express");
const bcrypt=require("bcryptjs"); 
const app=express();

const port=process.env.PORT || 8000;
require("./db/conn");
const Student=require("./db/models/registers");
app.set("view engine","hbs");


app.use(express.urlencoded({extended:false}))
app.use(express.json());


const RegisterRouter=require("./routers/register");
app.use(RegisterRouter);

app.use(express.static('public'));

// console.log(process.env.SECRET_KEY);
app.get('/register',(req,res)=>{
  res.status(201).render("index");
});

app.post("/register",async(req,res)=>{
  try{
      console.log(req.body);
      const password=req.body.password;
      const cpassword=req.body.cpassword;
      if(password === cpassword){
          const registerUser = new Student({
              name:req.body.name,
              number:req.body.number,
              email:req.body.email,
              password:req.body.password,
              confirmpassword:req.body.cpassword

          });
          const token=await registerUser.generateAuthToken();
          console.log("token part" + token);
          const user=await registerUser.save();
         res.status(201).render("index");
          
      }
          else{
              res.send("password not matching");
          }
          res.send("Data Submitted");
      }


  catch (err) {
      console.log(err.message);
      console.log(err);
      res.send(err);
  }
})




app.get('/login',(req,res)=>{
  res.status(201).render("index");
});

app.post('/login',async(req,res)=>{
  try{
      const email=req.body.email;
      const password=req.body.password;
      const  useremail = await Student.findOne({email:email});

      const isMatch=await bcrypt.compare(password,useremail.password);
      const token=await useremail.generateAuthToken();
      console.log("token part" + token);
      if(isMatch){
        res.status(201).render("index");

      }
     
      else{
          res.send("invalid login details ");
      }
      

  }
  catch (err){
      res.status(400).send(err);
  }

})
// const jwt=require("jsonwebtoken");
// const createToken=async()=>{
//   const token=jwt.sign({_id:"62cc120b819b328a0c539172"},"mynameisneerajmynameisneerajmynameisneeraj",{
//     expiresIn:"2 seconds"
//   })
//   console.log(token);
//   const userVerf=jwt.verify(token,"mynameisneerajmynameisneerajmynameisneeraj")
//   console.log(userVerf);
// }
// createToken();

app.listen(port,()=>{
    console.log(`server listen at port number ${port} `)
})