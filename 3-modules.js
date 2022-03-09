const {john, peter} = require('./4-names')
const sayHi = require('./5-utils')
const data = require('./6-alternative_flavor')

console.log(data.singlePerson);

sayHi('susi')
sayHi(john)
sayHi(peter)
