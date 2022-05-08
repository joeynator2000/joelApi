New read me:
requirements before being able to run the application:
- have NodeJS installed. Install here: https://nodejs.org/en/download/
- have Xampp installed. install here: https://www.apachefriends.org/de/index.html
- have CROS chrome extension installed. install here: https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf/related?hl=en-US
- To use the dashboard the Chrome extension CORS needs to be installed -> go to options and make sure that "Access-Control-Allow-Headers" is turned on! link provided below
- Have JAVA HOME environment variable set up. Follow this tutorial: https://javatutorial.net/set-java-home-windows-10/
- install Postman to test the api calls!

Extra help if required:
- local mysql database such as xampp is required. (edit the login details on source/services/database.ts, database can be found in database folder in root directory)
- To import the file on xampp, click on the joel_api database on the left-hand side, then click import, and choose the file in this project in the file location: root/database/joel_api.sql 
- Once java home is set up, in order to run npm i command you might need to reset your ide
- For the cros chrome extension, make sure to click on the icon at the extensions at the top right and make sure it is activated. When inspecting the webpage the api calls are still blocked, go to the options of the chrome extension and allow the reception of unverified api call sources.

get started:
1. open XAMPP and create a database with the name: joel_api
2. import the database into the joel_api database over the xampp UI via the import button (import the database file found in this projects root/database/joel_api.sql) 
3. Make sure your local machiene has node js installed in order to run the api!
   1. Open the terminal in your IDE or open the command prompt and navigate to this projects directory
   2. run the command: `npm i` or `npm install` to install all the required dependencies
4. Start the server by running the following command in the terminal: `npm run dev`

How to use api:
* (Setup step perform once) run npm i or npm install in the terminal to set your node dependencies
* http://localhost:6061 is the base address (this can be used in postman as address to test the api)
* Requires header for getters and posts!!! key name "content-type" with value application/json or application/xml (will determine what return type of the data)
* extensive explanations for ALL routes can be found on the post.ts file in file directory: projectroot/source/routes/post.ts

How to run the dashboard:
- make sure the CROS chrome extension is running and is turned on!
- simply open the dashboard.html file in your IDE and open it in the top right corner by clicking on the chrome icon to run it in google chrome!
- otherwise copy the file path of the location of the html file into your Google Chrome browser and open it manually like that! 
- instructions on what to do can be found on the dashboard itself.

Justifications for route method types:
- the GET method has been used for all the functions which return data from the api. This is because the GET method it is a safe and independant method that does not manipulate any of the data
- The POST method has been used for functions which send data to be added to the database, or said differently, add data that does not already exist in the database
- The PUT method is used to update resources or data in the dataset that already exists within the database. 
- The DELETE method is used to remove resources from the database

Other justifications:
- The names in the database of countries with spaces in them have been modified to not hold any spaces. This is because, in order to create xml tags with the countries name as the tag, xml formatting requires the tag name to not hold any spaces. As a result, spaces and other special characters such as " or ' have been removed.
- As this api is running on a javascript basis,there is no way to natively process xml, which is why the java_home environment variable has been set up. The api uses the computers local java to process the xml. In order to produce proper xml, the returned data of the database had to be converted into a new structure for this library to be used effectively. This is because with the mysql returned json results, the created xml had numbers as tag names, which is not allowed for proper xml tags.

No get all from suicide rates method:
- There is no method for getting all suicide rates as the dataset used by the student is very broad and only a fraction of the available data is required. Because of this, the student created a get all from a specified country api call, as this is relevant for the consuming web application of the joel api.
