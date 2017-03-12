'use strict';
const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'db/data.json');

let DATA = require(DB_PATH);

function reqHandler(req, res) {
    const url = req.url.split('/').slice(2);

    if (req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        if (!url.length) {
            res.end(JSON.stringify(DATA));
        } else {
            const getData = url.reduce((acc, curr) => {
                return acc[curr] || acc;
            }, DATA);

            if (!Object.keys(DATA).length) {
                res.statusCode = 204;
            }

            res.end(JSON.stringify(getData));
        }
    }

    if (req.method === 'POST') {
        let body = [];

        req
            .on('data', CHUNK => {
                body.push(CHUNK);
            })
            .on('end', () => {
                Object.assign(DATA, url.reduce((acc, curr, idx) => {
                    if (idx === url.length - 1) {
                        acc[curr] = Object.assign(acc[curr] || {}, JSON.parse(body.toString()));
            
                        return DATA;
                    } else {
                        return acc[curr] = acc[curr] || {};
                    }
                }, DATA))

                fs.writeFile(DB_PATH, JSON.stringify(DATA), (err) => {
                    console.log(err);
                    res.statusCode = 201;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(body.toString());
                });
            });
    }
}

module.exports = reqHandler;