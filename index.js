const express =  require("express");
const cors = require("cors");
const app = express();
const parser = require("body-parser");
const port = 3000;

app.use(parser.json())

app.use(cors({
    origin: '*'
}))
const { Client, Pool } = require('pg');
var fs = require('fs');
const bodyParser = require("body-parser");
const axios = require('axios'); //Import axios

//Connecting DB      
const pool = new Pool({
  user: 'ug1xz2np7ujagni29qcz',
  host: 'bs923otvx5e72xuiol3x-postgresql.services.clever-cloud.com',
  database: 'bs923otvx5e72xuiol3x',
  password: 'fVyvAT7re7tMyFTiV0iJFkshuutniX',
  port: 50013,

})

//Creating API
const api1 = async () => {
    const client = await pool.connect();
    const res = await client.query('SELECT 1')
    console.log(res.rows[0])
    client.release();
}

api1();

app.get("/hello", async (req, res)=>{
console.log('sucess')
})


//API for Sign Up
app.post("/login", async (req,res) =>
{
  console.log(req.body);
    try {
        let formData = JSON.parse((req.body.data));
        let qry=`select email from public.login where email='${formData.email}'`;
        console.log("email qry",qry);
        const db = await pool.connect();
        let dbRes = await db.query(qry);
        db.release();
        console.log("Check if mail exists", dbRes)
        if(dbRes.rowCount>0)
        {
          console.log("WOrking");
          res.send({status: 206, data: {msg: "Email already Registered"}});          
        }
        else
        {
          let query = `INSERT INTO public.login(
            "Name", email, password)
            VALUES ('${formData.name}', '${formData.email}', '${formData.password}');`
          console.log("QRY",query)
          const client = await pool.connect();
          let response = await client.query(query);
          client.release();
          console.log(response);
          res.status(201).send({status: 201, data: {msg: "Signed up."}});
        }   
    } catch (error) {
        res.status(500).send({status: 400, data: {msg: "Internal Error"} });
    }
}
)

//API for Login
app.post("/signin",async(req,res)=>
{
  console.log(req.body);
  try {
        let formData = JSON.parse((req.body.data));
        let qry=`select * from public.login where email='${formData.email}' AND password='${formData.password}'`
        const db= await pool.connect();
        let dbres=await db.query(qry);
        db.release();
        console.log(dbres);
        if(dbres.rowCount>0)
        {
          console.log("signin  WOrking");
          res.status(201).send({status: 201, data: {msg: "Signed in Successfull.", id: dbres.rows[0].id, name:dbres.rows[0].Name}});
        }
      }
  catch (error) {
    res.status(500).send({status: 500, data: {msg: "Internal Error"} });
}
})
  

//API for Fetching Movie Data
// http://www.omdbapi.com/?i=tt3896198&apikey=83e8faf1
const apiKey = '83e8faf1';
const apiUrl = `http://www.omdbapi.com/?&apikey=${apiKey}`;


app.post("/search", async(requestData, res)=>
{
  try{
    console.log(requestData.body)
   
    let formData = JSON.parse((requestData.body.data));
    console.log(formData);
    if(formData.id===1)
    {
      console.log(formData.title);
      const encodedTitle = encodeURIComponent(formData.title).replace(/%20/g, '+')
      const url = `${apiUrl}&s=${encodedTitle}`;
      // const url=   `http://www.omdbapi.com/?s=${encodedTitle}&apikey=83e8faf1`;
      // Use axios instead of fetch for Node.js
      const response = await axios.get(url);
      // Send the response data to the client
      console.log(response)
      res.send(response.data);
    }
    else
    {
      console.log(formData.title);
      const url = `${apiUrl}&i=${encodeURIComponent(formData.title)}`;
      const response = await axios.get(url);
      console.log(response)
      res.send(response.data);
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
});
// app.get();


  














app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});