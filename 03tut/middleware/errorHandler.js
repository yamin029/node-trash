const {logEvent} = require('./logEvent')

const errorHandler = (err,req, res, next) => {
    logEvent(`${err.name} \t ${err.message} `, 'errLog.txt')
    console.error(err.stack);
    res.status(500).send(err.message)
}

module.exports = errorHandler