import React, { Component } from 'react'
import './App.css'
import swarm from 'webrtc-swarm'
import signalhub from 'signalhub'
import SearchBar from './components/SearchBar'
import ram from 'random-access-memory'
import hyperdb from 'hyperdb'

function ConnectionStatus ({ isConnected }) {
  return isConnected
    ? <p style={{ color: 'green' }}>Connected to Masq</p>
    : <p style={{ color: 'red' }}>Disconnected from Masq</p>
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      items: [],
      isConnected: false
    }
    this.onSearch = this.onSearch.bind(this)
  }

  async onSearch (query) {
    console.log('query:', query)
    console.log(this.db)
    this.db.put(query, 'ok', (err) => {
      if (err) return console.error(err)
    })
  }

  async componentDidMount () {
    const hub = signalhub('swarm-example-masq', ['localhost:8080'])
    const sw = swarm(hub)
    sw.on('peer', function (peer, id) {
      console.log('connected to a new peer:', id)
      console.log('total peers:', sw.peers.length)
      // console.log(peer)

      peer.send(JSON.stringify({ cmd: 'requestDB' }))

      peer.on('data', data => {
        const json = JSON.parse(data)
        console.log(json)
        const cmd = json.cmd
        if (cmd === 'key') {
          console.log(json.key)
          this.db = window.db = hyperdb(ram, json.key)
          this.db.on('ready', () => {
            this.db.watch('', () => console.log('folder has changed'))
            console.log('####', this.db.discoveryKey.toString('hex'))
            let hub = signalhub(this.db.discoveryKey.toString('hex'), ['localhost:8080'])
            let swarmDB = swarm(hub)
            swarmDB.on('peer', peer => {
              const stream = this.db.replicate({ live: true })
              peer.pipe(stream).pipe(peer)
            })

            peer.send(JSON.stringify({ cmd: 'key', key: this.db.local.key }))
          })
        }

        if (cmd === 'succes') {
          console.log('success, close all')
          sw.close()
        }
      })
    })

    sw.on('disconnect', function (peer, id) {
      console.log('disconnected from a peer:', id)
      console.log('total peers:', sw.peers.length)
    })

    // const key = window.location.hash.substr(1)
    // const db = hyperdb(ram, key ? key : undefined)
    // this.db = db
    // window.db = db
    // const hub = signalhub('secret-swarm-id2', ['localhost:8080'])

    // db.on('ready', () => {
    //   const sw = swarm(hub)
    //   console.log('key is', db.key.toString('hex'))

    //   let checkout = db.checkout()
    //   db.watch('', () => {
    //     console.log('folder has changed')
    //     const diffStream = db.createDiffStream(checkout)
    //     diffStream.on('close', () => console.log('diff closed'))
    //     diffStream.on('end', () => {
    //       console.log('diff destroy')
    //       diffStream.destroy()
    //       checkout = db.checkout()
    //     })
    //     diffStream.on('data', data => {
    //       console.log('diff', data)
    //       let items = this.state.items.slice()
    //       items.push(data.left[0].key)
    //       this.setState({ items })
    //     })
    //   })

    //   db.list((err, list) => {
    //     if (err) return console.error(err)
    //     console.log(list[0])
    //     if (list[0]) {
    //       const items = list[0].map(elem => elem.key)
    //       console.log('items', items)
    //       this.setState({
    //         items: items
    //       })
    //     }
    //   })

    //   sw.on('peer', function (peer, id) {
    //     console.log('connected to a new peer:', id)
    //     console.log('total peers:', sw.peers.length)
    //     console.log(peer)
    //     const stream = db.replicate({ live: true })
    //     peer.pipe(stream).pipe(peer)
    //   })

    //   sw.on('disconnect', function (peer, id) {
    //     console.log('disconnected from a peer:', id)
    //     console.log('total peers:', sw.peers.length)
    //   })
    // })
  }

  render () {
    const { isConnected } = this.state
    return (
      <div className='App'>
        <ConnectionStatus isConnected={isConnected} />
        <SearchBar onSearch={this.onSearch} items={this.state.items} />
      </div>
    )
  }
}

export default App
