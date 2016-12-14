var express = require("express"),
	bodyParser = require("body-parser"),
	expressValidator = require("express-validator"),
	cabs = require("./cab_details"), //List of cabs and there location
	getDistance = require("./getDistance");  //Function to calculate distance betweeen two geo locations

//Initilize express app
var app = express();

//Initilize bodyParser
app.use(bodyParser.json());

//Initilizing express validator
app.use(expressValidator()); 


//Serves HTML file to list unallocated cabs
app.use("/", express.static(__dirname + "/public"));


//List all cabs based on query
app.get("/cabs",(req,res)=>{
	var _cabs = [];
	if(req.query.type == "allocated"){
		_cabs = cabs.filter((cab)=>{if(cab.allocated){ return cab }});//get all allocated cabs
	}else if(req.query.type == "unallocated"){
		_cabs = cabs.filter((cab)=>{if(!cab.allocated){ return cab }});//get all unallocated cabs
	}else{
		_cabs = cabs; //get all cabs
	}
	res.send(_cabs);
})

/*
 * Book a ride
 * Allocate cabs to customers based on there request
 * Sample Request Body
 * {
 *  "pickup_lat":"12.9749",
 *  "pickup_long":"77.6094",
 *  "need_pink": false
 * } 
 */
app.post("/cabs",(req,res)=>{
	req.checkBody("pickup_lat", "Invalid pickup_lat").notEmpty();
	req.checkBody("pickup_long", "Invalid pickup_long").notEmpty();
	req.checkBody("need_pink", "Invalid need_pink").notEmpty();
	req.sanitizeBody("need_pink").toBoolean();
	//Check for validation errors
	var errors = req.validationErrors();
	if (errors) {
		return res.status(400).send(errors);
	}
	
	let available_cabs = [];
	let nearest_cab = {"name":"",distance: 900000};
	cabs.forEach((cab)=>{
		if(!cab.allocated){
			if(req.body.need_pink){
				cab.is_pink ? available_cabs.push(cab) : "";	
			}else{
				available_cabs.push(cab);
			}
		}
	})
	if(available_cabs.length > 0){
		//Generate distance matrix of avilable cabs
		available_cabs.forEach((cab) =>{
			let distance = getDistance( cab["lat"],cab["long"],req.body.pickup_lat,req.body.pickup_long);
			if(distance < nearest_cab.distance){
					nearest_cab.name = cab.name;
					nearest_cab.distance = distance;
			}
		})
		//Changing cab aloocation status
		cabs.forEach((cab)=>{
			cab.name === nearest_cab.name ? cab.allocated = true : ""
		})
		//Send cab details with http status 201
		res.status(201).send(nearest_cab);
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
 * 	"cabName": "cab1" //Since we don"t have any id to deal with.
 * } 
 */
app.put("/cabs",(req,res)=>{
	req.checkBody("drop_lat", "Invalid drop_lat").notEmpty();
	req.checkBody("drop_long", "Invalid drop_long").notEmpty();
	req.checkBody("cabName", "Invalid cabName").notEmpty();
	
	//Check for validation errors
	var errors = req.validationErrors();
	if (errors) {
		return res.status(400).send(errors);
	}
	let _cab = {}
	cabs.forEach((cab)=>{
			if(cab.name === req.body.cabName){
				 if(!cab.allocated) //Check for unallocated cab
					return res.status(400).send({"message": "This cab is not yet allocated"});
				 cab.allocated = false;
				 _cab = cab;
			 }
	})
	let distance_fair = getDistance(_cab.lat,_cab.long,req.body.drop_lat,req.body.drop_long)*2;
	var total_fair = _cab.is_pink ? distance_fair + 5 : distance_fair; 
	res.send({"message":"Thanks for traveling with us","totalFair": Math.round(total_fair)});
})

//Listen app at port 8080
app.listen(8080, ()=>{
		console.log("App is listening in 8080");
})
