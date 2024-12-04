const express = require('express');

const app = express();

app.get("/",(req,res)=>{
    res.send('Home')
})

app.get("/hello",(req,res)=>{
    res.send('Hello... Hello... Hello...');
})

app.get("/test",(req,res)=>{
    res.send('Hello from the server')
})

app.listen(3000, ()=>{
    console.log('Server is successfully listening on port 3000...');
    
});