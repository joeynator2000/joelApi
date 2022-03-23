How to use api:
* run npm run dev in terminal
* http://localhost:6060 is the base address

Available commands:
* get data from a specified id range (required to place type key with json/xml value in header): GET /table/startingId/endingId
* update by id, pass valid json or xml in body: PUT /table/id
* delete by id: DELETE /table/id
* add entery to dataset: POST /table

notes
could have made xml sequence of elements to bundle the output xml

could have made elegant delegate solution for the repeating code in the validators to choose what schema to pick for validation