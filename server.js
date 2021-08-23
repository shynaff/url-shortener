require('dotenv').config();
const express = require('express'),
      cors = require('cors'),
      app = express(),
      bodyParser = require('body-parser');


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/api/shorturl', express.urlencoded({extended:true}));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

//url-shortener
app.post('/api/shorturl', (req, res, next)=>{
  const ResultJson = {};
  let x = Math.floor((Math.random() * 10) + 1);
  
  if(req.body.url) {
    ResultJson.original_url = req.body.url;
    ResultJson.short_url = x;
  }else ResultJson = {error:'invalid url'};
  
  if(/https:[/][/]/.test(ResultJson.original_url)){
    res.send(ResultJson);
    next(app.get('/api/shorturl/'+ResultJson.short_url, (req, res)=>{ 
    res.redirect(ResultJson.original_url);
    }));
  }else res.json({error:'invalid url'});
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});