const { format } = require('date-fns')
const { v4:uuid } = require('uuid')

const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const { dirname } = require('path')

const logEvent = async (messages,logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}${uuid()}\t${messages}\n`
    //console.log(logItem)
    try{
        if(!fs.existsSync(path.join(__dirname, 'logs'))){
            await fsPromises.mkdir(path.join(__dirname,'logs'))
        }
        //testing
        await fsPromises.appendFile(path.join(__dirname,'logs',logName), logItem);
    }catch (err){
        //console.log(err)
    }
}

module.exports = logEvent;
