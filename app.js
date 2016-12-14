const express = require('express'),
	   bodyParser = require('body-parser'),
	   cabs = require('./cab_details'),
	   lib = require('./getDistance');

var app = express();
app.use(bodyParser.json());

console.log(lib)
app.get('/',(req,res)=>{
	res.send({"message":"I am Listening"});
})

app.get('/cabs',(req,res)=>{
	res.send(cabs);
})

app.post('/cabs',(req,res)=>{
	
	avl_cabs = [];
	cabs.forEach((cab)=>{
		console.log(cab);
		if(cab.allocated === false){
			avl_cabs.push(cab);
		}
	})
	if(avl_cabs.length > 0){
		avl_cabs[0]['allocated'] = true;
		res.send(avl_cabs);
	}else{
		res.status(400).send({"message":"Sorry..! No cabs avilable, please try again in some time"});
	}
})



app.listen(8080, ()=>{
		console.log("App is listening in 8080");
})
