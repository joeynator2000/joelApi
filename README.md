Requirements:
- node installed
- JAVA_HOME environment variable is set up and has JDK and Javac (required for xml validation)
- local mysql database such as xampp is required. (edit the login details on source/services/database.ts, database is found in database folder in root directory)

How to use api:
* run npm run dev in terminal
* http://localhost:6060 is the base address
* Requires header!!! key name "type" with value json or xml (will determine what return type is desired and required)
* To use the dashboard the Chrome extension CORS needs to be installed -> go to options and make sure that "Access-Control-Allow-Headers" is turned on! link provided below

Chrome extension for running dashboard.  
https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf/related?hl=en-US

Available commands (all routes found under source/routes/post.ts:
* get data from a specified id range (required to place type key with json/xml value in header): GET /table/startingId/endingId
* update by id, pass valid json or xml in body: PUT /table/id
* delete by id: DELETE /table/id
* add entry to dataset: POST /table

What went well:
I am very proud of having achieved xml validation in javascript, as it uses java to validate. Furthermore, the database posed a little of a challenge, however, creative querying solved the problem in the end.

Even better if:
The database was not ideal for this project. Ideally I would either have a non-relational database, or data structured in a manner that columns are not values.

notes
could have made xml sequence of elements to bundle the output xml

could have made elegant delegate solution for the repeating code in the validators to choose what schema to pick for validation