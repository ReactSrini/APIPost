var fs = require ('fs');
var config = require ('./Config.json');
var axios=require('axios');
var bluebird=require('bluebird');
//Reading input file info from Config
var inputFilePath = config.inputFilePath;
var moduleName,sectionName,cardName,outputString = "";
var questionArray=[];
var questionRequest;

var promise =  new Promise((resolve,reject)=>
{
   fs.readFile(inputFilePath,'utf8',(err,data)=>
   {
    resolve(data);
    reject(err);
   })
    
} )
.then(value=>{
    var jsonData =[];
    jsonData= JSON.parse(value);
    console.log("[");
    extractJSON(jsonData,"");
    callAPI(0);//0=>bluebird.map,1=>bluebird.mapSeries
    console.log("]");
})
.catch(err=>{
    console.log(err);
})

//Parsing logic
function extractJSON(obj,objectPath)
{
    var identifier;
    for(const i in obj)
    {
        identifier=i;
        if(Array.isArray(obj[i]) || typeof obj[i]==='object') // header
        {
            //>sections>>0>>cards>>0>>items>>0>question : key metrics and deltas
            //to remove numeric values from object name  to make test cases  (just display data will be modified,original data will never be afftected)
            if(isFinite(identifier)===true) 
             {
                extractJSON(obj[i],objectPath); 
             }
            else
             {
                extractJSON(obj[i],objectPath + '>' + i + '>');    
             }  
        }
        else
        {
            switch(objectPath + i)
            {
                case '>sections>name' :
                    sectionName = obj[i];
                    break;
                case '>sections>>cards>name' :
                    cardName=obj[i];
                    break;
                case '>sections>>cards>>items>question' :
                    //outputString="{"+moduleName+"."+sectionName+"."+cardName+".["+obj[i]+"]}"     
                    //console.log(outputString);
                    questionArray.push(obj[i]); // questions list for API request
                    sectionName=cardName="";
                    break;
                    case 'name': //module name,  this case will become true only once
                    moduleName=obj[i];
                    
            }
        
        }
    }
    
}
function callAPI(mode) //mode=> 0=map, 1=mapSeries
    {
        //Passing Questions to API, questionArray contains list of questions
        var context=new Object()   //empty object   
        var initialTime;
        var endTime;
        if(mode=0)
        {
          //  initialTime = new Date();//to check how much time it takes
          questionRequest=    bluebird.map(questionArray,function(i)
            {
      axios.post('http://localhost:3000/parsing', {
                question : i, 
                apiObj   : context          
               })
            
            })
            .catch(function (error) {
                 console.log(error);
               });
            // endTime=new Date();
            // console.log("Time taken by map () : " + Math.hours(endTime.getTime()-endTime.getTime()));
        }
        else
        {
       //     initialTime = new Date();//to check how much time it takes
       questionRequest=  bluebird.mapSeries(questionArray,function(i)
            {
                        axios.post('http://localhost:3000/parsing', {
                question : i, 
                apiObj   : context          
               })
            })
     //       console.log("Time taken by mapSeries () : " + new Date()-initialTime)
        }
         
        // console.log(questionRequest)
        //     Promise.all(questionRequest)
//   .then(responses => responses.forEach(
//    // response => console.log(response.data)
    }