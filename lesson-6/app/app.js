'use strict';

const express       = require('express');
const bodyParser    = require('body-parser');
const values        = require('object.values');
const redis         = require('redis');
const fs            = require('fs');

const PORT          = process.env.PORT          || '8080';
const HOSTNAME      = process.env.HOSTNAME      || '127.0.0.1';
const DB_PORT       = process.env.DB_PORT       || '6379';
const DB_HOSTNAME   = process.env.DB_HOSTNAME   || 'localhost';

const client = redis.createClient(DB_PORT, DB_HOSTNAME);
const indexPageHtml = fs.readFileSync('./index.html', 'utf8');

function startServer() {
    const app = express();
    const urlencodedParser = bodyParser.urlencoded({
        extended: false
    })

    app
        .use((req, res, next) => {
            process.stdout.write(`${req.method}: ${req.url}\n`);
            next();
        })
        .get('/', (req, res) => {
            client.hgetall('form_data', (err, obj) => {
                if (err) {
                    return res.send(err.message);
                }

                const data = obj ? values(obj) : [];

                res.send(indexPageHtml.replace('<ul>', '<ul>' + data.map(val => '<li>' + val + '</li>').join('')));
            })
        })
        .post('/submit', urlencodedParser, (req, res) => {
            const data = req.body.data;

            if (data) {
                const time = new Date().getTime().toString();

                return client.hset('form_data', 'data_' + time, req.body.data, (err) => {
                    if (err) {
                        return res.send(err.message);
                    }
        
                    res.redirect('/');
                });
            }

            return res.send('Not empty string please');
        })
        .listen(PORT, HOSTNAME, () => {
            process.stdout.write(`App is listening on http://${HOSTNAME}:${PORT}\n`);
        })
}

client
    .on('ready', startServer)
    .on('error', (err) => {
        process.stderr.write(`${err.message}\n`);

        if (err.code === 'ECONNREFUSED') {
            client.quit();
        }
    })
