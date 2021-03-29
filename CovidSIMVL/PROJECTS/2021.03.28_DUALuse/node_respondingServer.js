var http = require('http');
var fs = require('fs');

console.log(__dirname);
http.createServer(function (req, res) {
  console.log(req.method);
  var request = req.url;
  var Lfile = request.substring(request.lastIndexOf('/')+1);
  request = Lfile;
  console.log(request);


    console.log("It is a json");
    fs.readFile(request, function(err,data){
      if (err){
        res.writeHead(404);
        res.write("Not Found");
      } else {
        res.writeHead(200,{'Access-Control-Allow-Origin': '*',
          'Content-Type' : 'text/plain'});
          res.write(data);
        }
        return res.end();
      })
}).listen(3001);
