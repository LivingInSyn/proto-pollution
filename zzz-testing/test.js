let Rectangle = class {
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }
    toString(){
        return "Rectangle"
    }
};

let foo = {foo: 1}
let r = new Rectangle(1,2)
foo.__proto__.toString = () => { return "foobar" }
console.log(foo.toString())
console.log(r.toString())
















/*
let foo = Object()
let asd = "asd"
































// let bar = {}



// let r = new Rectangle(1,2)
// var baz = "bar"
*/
console.log('done')
