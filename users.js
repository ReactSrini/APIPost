//npm install --save body-parser
var express        =         require("express");
var bodyParser     =         require("body-parser");
var app            =         express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(3000,function(){
  console.log('listening...')
});

app.post('/parsing',function(req,res)
{
  console.log('success');
  var question=req.body.question;
  console.log("question : " + question);
  var arr=[ {name : 'aaa',
            place : 'Chennai'
  }];
  //res.end("yes");
  res.json({arr});
});


//module.exports = router;
