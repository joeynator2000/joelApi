New read me:

get started:
1. open XAMPP and create a database with the name: joel_api
2. import the database into the joel_api database over the xampp UI via the import button (import the database file found in this projects root/database/joel_api.sql) 
3. Make sure your local machiene has node js installed in order to run the api!
   1. Open the terminal in your IDE or open the command prompt and navigate to this projects directory
   2. run the command: `npm i` or `npm install` to install all the required dependencies
4. You can now run `npm run dev` to start up the api


Requirements:
- node installed
- JAVA_HOME environment variable is set up and has JDK and Javac (required for xml validation) (This link will provide you with assistance if required: https://docs.oracle.com/cd/E21454_01/html/821-2532/inst_cli_jdk_javahome_t.html)
- local mysql database such as xampp is required. (edit the login details on source/services/database.ts, database can be found in database folder in root directory)

How to use api:
* (Setup step perform once) run npm i or npm install in the terminal to set your node dependencies
* http://localhost:6060 is the base address (this can be used in postman as address to test the api)
* Requires header!!! key name "type" with value json or xml (will determine what return type is desired and required)
* To use the dashboard the Chrome extension CORS needs to be installed -> go to options and make sure that "Access-Control-Allow-Headers" is turned on! link provided below
* run npm run dev in terminal (This command will start the api. to restart if a crash happens type rs, Ctrl + C to terminate the server activities)

Chrome extension for running dashboard.  
https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf/related?hl=en-US

Available commands (all routes found under source/routes/post.ts):
* get data from a specified id range (required to place type key with json/xml value in header): GET /table/startingId/endingId
* update by id, pass valid json or xml in body: PUT /table/id
* delete by id: DELETE /table/id
* add entry to dataset: POST /table

The specific table names can be viewed on the source/routes/post.ts file, instructions for the required parameters are displayed with comments!
To test the api using postman, simply copy one of the path names in the post.ts file and ensure that the postman configurations match the comments above the route you are testing. The server responses should also give an indication as to what the problem is.

What went well:
I am very proud of having achieved xml validation in javascript, as it uses java to validate. Furthermore, the database posed a little of a challenge, however, creative querying solved the problem in the end.

Even better if:
The database was not ideal for this project. Ideally I would either have a non-relational database, or data structured in a manner that columns are not values.

notes
could have made xml sequence of elements to bundle the output xml

could have made elegant delegate solution for the repeating code in the validators to choose what schema to pick for validation