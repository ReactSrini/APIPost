var fs = require ('fs');
var config = require ('./Config.json');
var axios=require('axios');
var bluebird=require('bluebird');
//Reading input file info from Config
var inputFilePath = config.inputFilePath;
var moduleName,sectionName,cardName,outputString = "";
var questionArray=[];
//var questionRequest=[];

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
var i=0;//index of question, to check promise order in api console log
var context=new Object()   //empty object to pass to API
//bluebid code  
    bluebird.mapSeries(questionArray,
        function(que){
        return  axios.post('http://localhost:3000/parsing', {
           question:++i + " :" + que, 
           apiObj  :context          
          }).then(res=>res.data)
        })
        .then(function(res)
        {
          console.log(res)
            
        })
                
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
    