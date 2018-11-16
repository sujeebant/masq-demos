const signalserver = require('signalhubws/server')
const server = signalserver()
server.listen(8080, () => console.log('server running'))
