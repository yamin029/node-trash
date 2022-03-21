const { format } = require('date-fns')
const { v4:uuid } = require('uuid')

const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const { dirname } = require('path')

const logEvent = async (messages,logName) => {
    //console.log('log event called');
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}${uuid()}\t${messages}\n`
    //console.log(logItem)
    try{
        if(!fs.existsSync(path.join(__dirname, '..','logs'))){
            console.log("directory created");
            await fsPromises.mkdir(path.join(__dirname, '..','logs'))
        }
        //testing
        await fsPromises.appendFile(path.join(__dirname, '..','logs',logName), logItem);
    }catch (err){
        //console.log(err)
    }
}

const logger = (req,res,next)=>{
    logEvent(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
    
    //console.log(`${req.method} ${req.path}`)
    next()
}

module.exports = {logEvent, logger};
