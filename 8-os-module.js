const os = require('os')

//info abour current user
const user = os.userInfo()
//console.log(user)

//methods returns the system uptime in second
console.log(`The system uptime is ${(((os.uptime())/60)/60)/24} days`)

const currentOS = {
    name : os.type(),
    release : os.release(),
    totalMem : os.totalmem(),
    freeMem : os.freemem()
}
console.log(currentOS)

