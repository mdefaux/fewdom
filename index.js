const http         = require('http'),
      fs           = require('fs'),
      path         = require('path'),
      env          = process.env;

contentTypes = {
    'html' : 'text/html',
    'css'  : 'text/css',
    'tag'  : 'text/html',
    'ico'  : 'image/x-icon',
    'png'  : 'image/png',
    'svg'  : 'image/svg+xml'
}

function sendFile (res, url) {
    fs.readFile('./static' + url, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        let ext = path.extname(url).slice(1);
        if (contentTypes[ext]) {
            res.setHeader('Content-Type', contentTypes[ext]);
        }
        if (ext === 'html') {
            res.setHeader('Cache-Control', 'no-cache, no-store');
        }
        res.setHeader('Set-Cookie', 'auth=test');
        res.end(data);
    });
}

let server = http.createServer(function (req, res) {
    let url = req.url;
  
    if (url === '/') {
      url += 'index.html';
    }
  
    sendFile(res,url);
});

server.listen(env.NODE_PORT || 4000, env.NODE_IP || 'localhost', function () {
    console.log(`Application worker ${process.pid} started...`);
});
  
function stop() {
    server.close();
}

module.exports = server;
module.exports.stop = stop;
  