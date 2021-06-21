'use strict';

const express = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const path = require('path');


const isObject = obj => obj && obj.constructor && obj.constructor === Object;

function merge(a, b) {
    for (var attr in b) {
        if (isObject(a[attr]) && isObject(b[attr])) {
            merge(a[attr], b[attr]);
        } else {
            a[attr] = b[attr];
        }
    }
    return a
}

function clone(a) {
    return merge({}, a);
}

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const admin = {};
let users = {}

// App
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

let baseUser = {
    'someValue': 1.0,
    'anotherValue': 'foobar'
}

app.use('/', express.static(path.join(__dirname, 'views')));
app.post('/signup', (req, res) => {
    var body = JSON.parse(JSON.stringify(req.body));
    let newuser = merge(baseUser, body)
    let foo = 'admin' in body
    if (newuser.name) {
        res.cookie('name', newuser.name).json({
            "done": "cookie set"
        });
        users[newuser.name] = newuser
    } else {
        res.json({
            "error": "cookie not set"
        })
    }
});
app.get('/getFlag', (req, res) => {
    var cookiename = JSON.parse(JSON.stringify(req.cookies))
    if (!cookiename){
        res.send("You are not authorized");
    }
    let user = users[cookiename.name]
    if (user && user.admin == 1) {
        res.send("hackim19");
    } else {
        res.send("You are not authorized");
    }
});
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);