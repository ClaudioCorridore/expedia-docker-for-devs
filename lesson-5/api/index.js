'use strict';

const http = require('http');

const reqHandler = require('./api');

const PORT = process.env.PORT || '8080';
const HOSTNAME = process.env.HOSTNAME || '127.0.0.1';

const server = http.createServer((req, res) => {
    switch (/^(\/$|\/api|.+$)/.exec(req.url)[1]) {
        case '/':
            res.setHeader('Content-Type', 'text/html');
            res.end('<h1>Welcome to this amazing API!</h1>');
            break;
        case '/api':
            reqHandler(req, res);
            break;
        default:
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end('<h1>404, you should not be here!</h1>');
    }
});

server.listen(PORT, HOSTNAME, () => {
    console.log(`Server il listening on http://${HOSTNAME}:${PORT}`);
});
