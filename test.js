var fs = require ('fs');
var config = require ('./Config.json');
var axios=require('axios');
var bluebird=require('bluebird');
//Reading input file info from Config
var inputFilePath = config.inputFilePath;
var moduleName,sectionName,cardName,outputString = "";
var questionArray=[];
var questionRequest=[];

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
    extractJSON(jsonData,"");                
    callAPI(0); // 0=>Promise.all() 1=>map 2=>mapSeries
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
    
function callAPI(mode) // 0=>Promise.all() 1=>map 2=>mapSeries
{
    var i=0;//index of question, to check promise order in api console log
var context=new Object()   //empty object to pass to API
var mode,startTime,endTime;
startTime=new Date();
 if(mode==0)
 {
     mode="Promise.all()"
     questionArray.map(que=>{
     questionRequest.push( axios.post('http://localhost:3000/parsing', {
        question:que, 
        apiObj  :context
       }))
    
 })           
      Promise.all(questionRequest)
      .then(responses => { responses.forEach(
       response => console.log(response.data))
       endTime=new Date();
       console.log("Mode       : " + mode);
       console.log("Start Time : " + startTime);
       console.log("End Time   : " + endTime);
      
    })
      
      .catch(err=>{
          console.log(err)
      })

 }
 else if(mode==1)
 {
        mode="map";
        bluebird.map(questionArray,
        function(que){
        return  axios.post('http://localhost:3000/parsing', {
           question:++i + " :" + que, 
           apiObj  :context          
          }).then(res=>res.data.data)
          .catch(err=>console.log(err))
        })
        .then(function(res)
        {
          console.log(res);
          endTime=new Date();
          console.log("Mode       : " + mode);
          console.log("Start Time : " + startTime);
          console.log("End Time   : " + endTime);
         
        })
        .catch(err=>console.log(err))

 }
 else if(mode==2)
 {
        mode="mapSeries";
        bluebird.mapSeries(questionArray,
        function(que){
        return  axios.post('http://localhost:3000/parsing', {
           question:++i + " :" + que, 
           apiObj  :context          
          }).then(res=>res.data.data)
          .catch(err=>console.log(err))
        })
        .then(function(res)
        {
          console.log(res);
          endTime=new Date();
          console.log("Mode       : " + mode);
          console.log("Start Time : " + startTime);
          console.log("End Time   : " + endTime);
         
        })
        .catch(err=>console.log(err))

 }
}