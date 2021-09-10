// import ws from 'ws'
const ws = require('ws')

const wss = new ws.Server({ port: 8080 })

wss.on('connection', function connection(ws) {
	ws.on('message', function incoming(message) {
		console.log('rescived: %s', message)
		ws.send('Hi')
	})
})

wss.on('close', () => {
	console.log('closed')
})