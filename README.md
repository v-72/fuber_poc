# Fuber POC project

a. cab_details.js contains cab details, like name, lat, log and is_pink.
b. getDistance.js Function to calculate distance betweeen two geo locations.

c.Sample requests:
1.GET Cabs
url: http://localhost:8080/cabs?type=allocated   (allocated/unallocated/all)
method: GET
output:
[
  {
    "lat": 12.9747,
    "long": 77.6094,
    "name": "Cab1",
    "is_pink": true,
    "allocated": true
  },
  {
    "lat": 12.9768,
    "long": 77.5723,
    "name": "Cab2",
    "is_pink": false,
    "allocated": false
  }]
  
2.Book aride
url: http://localhost:8080/cabs
method: POST
request_body: 
{
  "pickup_lat":"12.9749",
  "pickup_long":"77.6094",
  "need_pink": false
  }

3.Finish Ride
url: http://localhost:8080/cabs
method: PUT
request_body:
  {
   "drop_lat":"12.9749",
   "drop_long":"77.6094",
  	"cabName": "cab1" //Since we don't have any id to deal with.
 } 
  
