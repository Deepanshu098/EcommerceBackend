const server = require('./app');

const host = process.env.HOST;
const port = process.env.PORT;

server.listen(port,host,()=>{
    console.log(`Server started at http://${host}:${port}`)
})