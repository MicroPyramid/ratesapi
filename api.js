var MongoClient = require('mongodb').MongoClient;
var http = require('http');
var url = require('url');
var fs = require('fs');

var db_url = "mongodb://localhost:27017/currency";

http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    pathname = url.parse(req.url).pathname;
    if (pathname.match(/^\/style.css\/$/) || pathname.match(/^\/style.css$/)) {
        res.writeHead(200, {'Content-type' : 'text/css'});
        var fileContents = fs.readFileSync('./style.css', {encoding: 'utf8'});
        res.write(fileContents);
        res.end();
    }
    else if (req.url === '/'){
        fs.readFile('./home.html', null, function(err, data){
            if(err){
                res.writeHead(404);
                res.write('Contents you are looking are Not Found');
                res.end();
            }else{
                res.write(data);
                res.end();
            }
        });
    }
    else if (pathname.match(/^\/api\/latest\/$/) || pathname.match(/^\/api\/latest$/)){
        MongoClient.connect(db_url, function(err, dbo) {
        var db = dbo.db("currency");
        var collection = db.collection('prices');
        fields = {base:1, date:1, _id:0, rates: 1}
        query = {'base': "EUR"}

        if(q.query['base']){
            query = {'base': q.query['base'].toUpperCase()}
        }
        if(q.query['symbols']){
            fields = {base:1, date:1, _id:0}
            symbols = q.query['symbols'].split(',')
            for (each in symbols){
                symbol = 'rates.' + symbols[each].toUpperCase()
                fields[symbol] = 1;
            }
        }
        var cursor = collection.find(query, {fields: fields}).sort({"date": -1}).limit(1).toArray(function(err, result) {
            if (err) throw err;
            dbo.close();
            if(result[0]){
                res.writeHead(200, {'Content-Type': 'text/json'});
                res.write(JSON.stringify(result[0]));
            }else{
                res.writeHead(400, {'Content-Type': 'text/json'});
                res.write(JSON.stringify({"error":"Invalid base or symbols"}))
            }
            res.end();
            });
        });

    }else if (pathname.match(/^\/api\/\d{4}([./-])\d{2}\1\d{2}$/)){
        MongoClient.connect(db_url, function(err, dbo) {
          var db = dbo.db("currency");
          var collection = db.collection('prices');
            fields = {base:1, date:1, _id:0, rates: 1}
            query = {'base': "EUR", 'date': { $lte: req.url.split('/api/')[1].split('?')[0].toString() } }
            if(q.query['base']){
                query['base']= q.query['base'].toUpperCase()
            }
            if(q.query['symbols']){
                fields = {base:1, date:1, _id:0}
                symbols = q.query['symbols'].split(',')
                for (each in symbols){
                    symbol = 'rates.' + symbols[each].toUpperCase()
                    fields[symbol] = 1;
                }
            }
          var cursor = collection.find(query, {fields: fields}).sort({date: -1}).toArray(function(err, result) {
            if (err){
                throw err;
            }
            dbo.close();
            if(result[0]){
                res.writeHead(200, {'Content-Type': 'text/json'});
                res.write(JSON.stringify(result[0]));
            }else{
                res.writeHead(400, {'Content-Type': 'text/json'});
                res.write(JSON.stringify({"error":"Invalid base or symbols"}))
            }
            res.end();
          });
        });
    }else{
        res.writeHead(404);
        res.write('Contents you are looking are Not Found');
        res.end();
  }
}).listen(8080);
