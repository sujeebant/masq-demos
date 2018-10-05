const swarm = require('webrtc-swarm')
const signalhub = require('signalhub')
const wrtc = require('wrtc')
const ram = require('random-access-memory')
const hyperdb = require('hyperdb')

// the unique swarm channel will be given by the app, off the record,
// masq will join the swarm when opening the link
const hub = signalhub('swarm-example-masq', ['localhost:8080'])
const sw = swarm(hub, { wrtc })

let db = null

sw.on('peer', function (peer, id) {
  console.log('connected to a new peer:', id)
  console.log('total peers:', sw.peers.length)
  // 1) App requests a new db
  // 2) Masq instantiate a db, start replicating, and send the key needed to READ the db to the app
  // 3) The app starts to replicate, then send its key to authorize it as a WRITER.
  peer.on('data', data => handleData(data, peer))
})

sw.on('disconnect', function (peer, id) {
  console.log('disconnected from a peer:', id)
  console.log('total peers:', sw.peers.length)
})

function createDB (peer) {
  console.log('creating DB')
  // Create new AppDB, asks user if he want to authorize it before
  db = hyperdb(ram)

  db.on('ready', () => {
    db.watch('', () => console.log('folder has changed'))
    // Join the swarm of this database
    const hubDB = signalhub(db.discoveryKey.toString('hex'), ['localhost:8080'])
    const swarmDB = swarm(hubDB, { wrtc })

    peer.send(JSON.stringify({
      cmd: 'key',
      key: db.key.toString('hex')
    }))

    swarmDB.on('peer', peer => {
      console.log('replicating...')
      const stream = db.replicate({ live: true })
      peer.pipe(stream).pipe(peer)
    })
  })
}

function authorize (key, peer) {
  db.authorize(Buffer(key), err => {
    if (err) return console.error(err)
    console.log('write access authorized')
    peer.send(JSON.stringify({ cmd: 'success' }))
  })
}

function handleData (data, peer) {
  let json = null
  try {
    json = JSON.parse(data)
  } catch (e) {
    console.error(e)
    return
  }

  const cmd = json.cmd

  if (cmd === 'requestDB') {
    return createDB(peer)
  }

  if (cmd === 'key') {
    return authorize(json.key, peer)
  }
}
