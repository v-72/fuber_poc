# Fuber POC project

cab_details.js contains cab details, like name, lat, log and is_pink.
getDistance.js Function to calculate distance betweeen two geo locations.

Sample requests:
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
  
