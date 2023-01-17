import http from "http"
const port = 37219;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
  'Access-Control-Max-Age': 2592000, // 30 days
};

let KVDB={}

console.log(`start http ok, port is ${port}.`)
http.createServer((req, res) => {

  if (req.method === 'OPTIONS') {
    let acrh = req.headers["access-control-request-headers"]
    let optHeaders={}
    Object.assign(optHeaders, headers);
    if(acrh){
      optHeaders["Access-Control-Allow-Headers"]=acrh
    }
    res.writeHead(204, optHeaders);
    res.end();
    return;

  }else if (req.method === 'GET') {
    let body = KVDB[req.url]
    if(!body){
      res.writeHead(404, headers);
      res.end("Not found");
      return;
    }
    res.writeHead(200, headers);
    res.end(body);
    return;

  }else if (req.method === 'POST') {
    let body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body)
      KVDB[req.url]=body
    });

    res.writeHead(200, headers);
    res.end("ok");
    return;

  }

  res.writeHead(405, headers);
  res.end("bad method");
}).listen(port);