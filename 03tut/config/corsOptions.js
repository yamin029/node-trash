const whitelist = [
    'https://www.yoursite.com',
    'https://127.0.0.1:5000',
    'https://localhost:4000'
]
const corsOptions = {
    origin : (origin, callback) =>{
        if(whitelist.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        }else{
            callback(new Error('Not allowed by cors'))
        }
    },
    optionSuccessStatus : 200
}

module.exports = corsOptions