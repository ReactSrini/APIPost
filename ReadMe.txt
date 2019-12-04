Files Required :
UI :
Index.js => UI/Frontend
External File Required => Home.json => Input file that will be parsed
Config.js=>Configuration file => Home.json path needs to be specified here

Server/API :
Serve.js=>API code is available here

Steps :

UI :
(1) Install axios in frontend (where index.js) is located
       ui_project_path> npm install npm install 
(2)Paste index.js and Config.js code,  and in index.js refer axios using var axios=require(axios)

Server/API:
(1) Install Express framework
	       api_project_path> npm install npm install express-generator g
(2) Create directory for API
                project_path> express MyAPI
(3) change directory to MyAPi anf then  Install npm dependencies
               project_path>cd MyAPI
               project_path\ MyAPI > npm install
(4) Install body-parser middleware
	project_path\ MyAPI > npm install --save body-parser
(5)Paste users.js code in MYAPI->routes->users.js (replace existing code)   

Execution Procedure : 
1. run users.js from api project  =>myAPI=>routes=>users.js
		project\myAPI>cd routes
		myAPI\routes>node users.js

2.run index.js frontend application => path> node index.js

Expected Output :
=>Question(string) and empty object will be passed to API and they will be displayed,
=>Also we will recieve response from api that contains a simple array
                  