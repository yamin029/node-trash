const http = require('http')
const path = require('path')
const fs = require('fs')
const fsPromises = require('fs').promises

const logEvent = require('./logEvent')
const EventEmitter = require('events')
class Emitter extends EventEmitter { }

const myEmitter = new Emitter()
myEmitter.on('log', (msg, fileName) => logEvent(msg, fileName));
const PORT = process.env.PORT || 4000

const serveFile = async(filePath, contentType, response)=>{
    try{
        const rawData = await fsPromises.readFile(
            filePath,
            !contentType.includes('image')?'utf8' : ''
            )
        const data = contentType ==='application/json' ? JSON.parse(rawData) : rawData
        response.writeHead(
            filePath.includes('404.html')? 400 : 200,
            {'contentType' : contentType,
        })
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        )
    }catch(err){
        myEmitter.emit('log', `${err.name}\t${err.message}`, 'errLog.txt')
        console.log(err);
        response.statusCode = 500
        response.end()
    }
}

const server = http.createServer((req, res) => {
    //console.log(req.url, req.method);
    myEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt')

    // console.log(req.url.slice(-1));

    const extension = path.extname(req.url)

    let contentType;

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }
    //console.log('\nextension - ',extension);
    //console.log('\ncontentType - ',contentType,'\n\n');
    let filePath =
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', req.url, 'index.html')
                : contentType === 'text/html'
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url);
    if(!extension && req.url.slice(-1) !== '/') filePath += '.html'

    //console.log(`file path ${filePath}`);

    const fileExists = fs.existsSync(filePath)

    //console.log(`file exist ${fileExists}`);

    if(fileExists){
        //serve the file
        //console.log('inside if \n');
        serveFile(filePath,contentType,res)
    }else{
        //404
        //301 redirect
        // console.log(path.parse(filePath));
        switch (path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301,{'location' : '/new-page.html'})
                res.end()
                break;
            case 'www-page.html' :
                res.writeHead(301,{'location' : '/'})
                res.end()
                break;        
            default:
                //serve 404 response
                serveFile(path.join(__dirname,'views','404.html'),'text/html',res)
                break;
        }

    }
})
//makes the .html not required in the borwser
server.listen(PORT, () => console.log(`server runnig on port ${PORT}`))



