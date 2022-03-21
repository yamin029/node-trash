const express = require('express')
const app = express()
const path = require('path')
//cors for package for cors error
const cors = require('cors')
//importing corsOption form config 
const corsOptions = require('./config/corsOptions')
const PORT = process.env.PORT || 4000
const {logger } = require('./middleware/logEvent')
const errorHandler = require('./middleware/errorHandler')

//custom middleware
app.use(logger)

//Cross Origin Resourse Shareing
app.use(cors(corsOptions))

//built-in middleware to handle urlencoded data
//in other words form data :
app.use(express.urlencoded({ extended: false}))

//built-in middleware for json
app.use(express.json())

//serve static file
app.use(express.static(path.join(__dirname, 'public')))
app.use('/subdir',express.static(path.join(__dirname, 'public')))

//routing to external subdirectory 
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/subdir',require('./routes/subdir'))
app.use('/employees', require('./routes/api/employees'))

//common routing for all of the route that did not match the previous conditions
app.all('*',(req,res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    }else if(req.accepts('json')){
        res.json({error : '404 not found'})
    }else{
        res.type('text').send('404 not found')
    }
   
})

//this is for the error handler that does not meet the requirement for the routing in the previous routes
//it state the error and save to the errLog.txt file
app.use(errorHandler)

//tis is for the server to listen on a specific port nubmer
app.listen(PORT, () => console.log(`server runnig on port ${PORT}`))