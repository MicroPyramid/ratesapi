let MongoClient = require('mongodb').MongoClient;
let http = require('http');
let url = require('url');
let fs = require('fs');

let db_url = "mongodb://localhost:27017/currency";

http.createServer(function (req, res) {
    let q = url.parse(req.url, true);
    pathname = url.parse(req.url).pathname;
    if (pathname.match(/^\/style.css\/$/) || pathname.match(/^\/style.css$/)) {
        res.writeHead(200, {'Content-type' : 'text/css'});
        let fileContents = fs.readFileSync('./style.css', {encoding: 'utf8'});
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
        const db = dbo.db("currency");
        const collection = db.collection('prices');
        let fields = {base:1, date:1, _id:0, rates: 1}
        let query = {'base': "EUR"}

        if(q.query['base']){
            query = {'base': q.query['base'].toUpperCase()};
        }
		if(q.query['from']&&q.query['to']&&q.query['amount']){
            conversion = {'from': q.query['from'].toUpperCase(),'to': q.query['to'].toUpperCase(),'amount': parseFloat(q.query['amount'].toUpperCase())};
			query['base'] =  q.query['from'].toUpperCase();
		}
		
		
        if(q.query['symbols']){
            fields = {base:1, date:1, _id:0}
            let symbols = q.query['symbols'].split(',')
            for (each in symbols){
                symbol = 'rates.' + symbols[each].toUpperCase()
                fields[symbol] = 1;
            }
        }
        let cursor = collection.find(query, {fields: fields}).sort({"date": -1}).limit(1).toArray(function(err, result) {
            if (err) throw err;
            dbo.close();
            if(result[0]){
                res.writeHead(200, {'Content-Type': 'text/json'});
				
				if(result[0].rates&&conversion){
					result[0].conversion={...conversion,result:result[0].rates[conversion.to]};
				}
				
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
          const db = dbo.db("currency");
          const collection = db.collection('prices');
          let fields = {base:1, date:1, _id:0, rates: 1}
          let query = {'base': "EUR", 'date': { $lte: req.url.split('/api/')[1].split('?')[0].toString() } }
            if(q.query['base']){
                query['base']= q.query['base'].toUpperCase()
            }
            if(q.query['symbols']){
                fields = {base:1, date:1, _id:0}
                let symbols = q.query['symbols'].split(',')
                for (each in symbols){
                    symbol = 'rates.' + symbols[each].toUpperCase()
                    fields[symbol] = 1;
                }
            }
          let cursor = collection.find(query, {fields: fields}).sort({date: -1}).toArray(function(err, result) {
            if (err){
                throw err;
            }
            dbo.close();
            if(result[0]){
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify(result[0]));
            }else{
                res.writeHead(400, {'Content-Type': 'application/json'});
                res.write(JSON.stringify({"error":"Invalid base or symbols"}));
            }
            res.end();
          });
        });
    }else{
        res.writeHead(404);
        res.write('Contents you are looking are Not Found');
        res.end();
  }
}).listen(process.argv.slice(2).length>0?process.argv.slice(2)[0]:8080);
