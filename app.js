const express = require('express'),
	   bodyParser = require('body-parser'),
	   cabs = require('./cab_details'), //List of cabs and there location
	   lib = require('./getDistance');  //Function to calculate distance betweeen two geo locations

//Initilize express app
var app = express();

//Initilize bodyParser
app.use(bodyParser.json());

//List all cabs based on query
app.get('/cabs',(req,res)=>{
	res.send(cabs);
})

/*
 * Allocate cabs to customers based on there request
 * Maximum Radius 20KM
 * Sample Request Body
 * {
 *  "pickup_lat":"12.9749",
 *  "pickup_long":"77.6094",
 *  "need_pink": false
 * } 
 */
app.post('/cabs',(req,res)=>{    
	let avl_cabs = [];
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

/*
 * Unallocate cab and calculate fair.
 * Sample Request Body
 * {
 *  "drop_lat":"12.9749",
 *  "drop_long":"77.6094",
 * 	"cabName": "cab1" //Since we don't have any id to deal with.
 * } 
 */
app.put('/cabs',(req,res)=>{
	res.send({"message":"Thanks for traveling with us"});
})

//Listen app at port 8080
app.listen(8080, ()=>{
		console.log("App is listening in 8080");
})
