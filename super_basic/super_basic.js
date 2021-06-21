let person = {name: 'John Doe'}
console.log("Person (Before): " + person)

person.__proto__.toString = () => { console.error('evil stuff') }
console.log("Person (After): " + person)

let person2 = {name: 'Bob'}
console.log("Person 2: " + person2)
