How to use api:
* run npm run dev in terminal
* http://localhost:6060 is the base address
* Requires header!!! key name "type" with value json or xml (will determine what return type is desired and required)
* To use the dashboard the chrome extension CORS needs to be installed -> go to options and make sure that "Access-Control-Allow-Headers" is turned on! link provided below

Chrome extension for running dashboard.  
https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf/related?hl=en-US

Available commands:
* get data from a specified id range (required to place type key with json/xml value in header): GET /table/startingId/endingId
* update by id, pass valid json or xml in body: PUT /table/id
* delete by id: DELETE /table/id
* add entery to dataset: POST /table

notes
could have made xml sequence of elements to bundle the output xml

could have made elegant delegate solution for the repeating code in the validators to choose what schema to pick for validation