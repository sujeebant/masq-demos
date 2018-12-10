const swarm = require('webrtc-swarm')
const signalhub = require('signalhubws')
const rai = require('random-access-idb')
const hyperdb = require('hyperdb')
const uuidv4 = require('uuid/v4')
const pump = require('pump')
const EventEmitter = require('events')
const dbExists = require('./indexedDBUtils').dbExists

const HUB_URL = 'wss://signalhub-jvunerwwrg.now.sh'
// const HUB_URL = 'localhost:8080'

const debug = console.log

/**
 * Return when hyperDb instance is ready
 * @param {Object} db - The hyperDb instance
 */
const dbReady = (db) => {
  return new Promise((resolve, reject) => {
    db.on('ready', () => {
      resolve()
    })
  })
}

class MasqMock extends EventEmitter {
  /**
   * constructor
   */
  constructor (options = {}) {
    super()
    this.currentProfile = null
    this.hubURL = options.hubURL || HUB_URL
    this.currentId = null
    this.localKey = null
    this.sws = {}
    this.hubs = {}
    this.channels = null
    this.challenge = null
    this.peer = null
    this.peers = {}
    this.masqProfiles = null
    this.dbs = {
      masqProfiles: null // masq public profiles
    }
  }

  async init () {
    await this.initProfiles()
  }

  async initProfiles () {
    return new Promise((resolve, reject) => {
      this.masqProfiles = hyperdb(rai('masq-profiles'), { valueEncoding: 'json' })
      this.masqProfiles.on('ready', async () => {
        const profiles = await this.get(this.masqProfiles, '/profiles')
        if (!profiles) {
          try {
            await this.set(this.masqProfiles, '/profiles', [])
          } catch (error) {
            console.log(error)
          }
        }
        resolve()
      })
    })
  }

  async createAppDb (name) {
    debug('I create hyperDB with this name :', name)

    return new Promise((resolve, reject) => {
      this.dbs[name] = hyperdb(rai(name), { valueEncoding: 'json' })
      this.dbs[name].on('ready', async () => {
        resolve(this.dbs[name].key)
      })
    })
  }

  /**
 * Return the value of a given key
 * @param {Object} db - The hyperdb instance
 * @param {string} key - The key
 * @returns {string|Object} - The value
 */
  get (db, key) {
    return new Promise((resolve, reject) => {
      db.get(key, function (err, data) {
        if (err) reject(err)
        if (!data[0]) {
          resolve(null)
        } else {
          resolve(data[0].value)
        }
      })
    })
  }

  /**
 * Return the value of a given key for a specific db
 * @param {string} dbName - The hyperdb instance name
 * @param {string} key - The key
 * @returns {string|Object} - The value
 */
  getItem (dbName, key) {
    const db = this.dbs[dbName]
    return new Promise((resolve, reject) => {
      db.get(key, function (err, data) {
        if (err) reject(err)
        if (!data[0]) {
          resolve(null)
        } else {
          resolve(data[0].value)
        }
      })
    })
  }

  /**
   * Set a key to the hyperdb
   * @param {Object} db - The hyperdb instance
   * @param {string} key - The key
   * @param {Object|string} value - The content
   * @returns {int} -The sequence number
   */
  set (db, key, value) {
    return new Promise((resolve, reject) => {
      db.put(key, value, err => {
        if (err) reject(err)
        resolve(value)
      })
    })
  }

  /**
 * Add a write permission to the db
 * @param {Object} db - The hyperdb instance
 * @param {Buffer} key - The key we will give the write permission
 */
  authorize (db, key) {
    return new Promise((resolve, reject) => {
      db.authorize(key, err => {
        if (err) reject(err)
        resolve()
      })
    })
  }

  /**
 * Check if the other hyperdb instance is authorized to write
 * @param {Object} dbname - The hyperdb instance name
 * @param {Buffer} key - The authorized hyperdb local key
 */
  isAuthorized (dbname) {
    return new Promise((resolve, reject) => {
      if (!this.localKey) console.log('the local key is not stored in MasqMock')
      this.dbs[dbname].authorized(this.localKey, (err, auth) => {
        if (err) reject(err)
        else if (auth === true) resolve(true)
        else resolve(false)
      })
    })
  }

  async getProfilesIds () {
    return this.get(this.masqProfiles, '/profiles')
  }

  async getProfiles () {
    return new Promise(async (resolve, reject) => {
      const ids = await this.getProfilesIds()
      let promiseArr = []
      for (let id of ids) {
        promiseArr.push(this.get(this.masqProfiles, `/profiles/${id}`))
      }
      return resolve(Promise.all(promiseArr))
    })
  }

  async setProfilesIds (ids) {
    await this.set(this.masqProfiles, '/profiles', ids)
  }

  async setProfile (username, profile) {
    const id = uuidv4()
    const withId = {
      username: profile.username,
      image: profile.image,
      id: id
    }
    const ids = await this.getProfilesIds()
    await this.setProfilesIds([...ids, id])
    await this.set(this.masqProfiles, `/profiles/${id}`, withId)
  }

  async getProfile (username) {
    const id = await this.getId(username)
    const profile = id ? await this.get(this.masqProfiles, `/profiles/${id}`) : null
    return profile
  }

  async getId (username) {
    const listProfiles = await this.getProfiles()
    const profile = listProfiles.filter(p => p.username === username)
    return profile[0].id
  }

  receiveLink (info) {
    switch (info.type) {
      case 'syncProfiles':
        debug(`Link for syncProfiles contains: ${info.channel} ${info.challenge}`)
        this.exchangeProfilesKey(info.channel, info.challenge)
        break
      case 'syncData':
        debug(`Link for syncData contains: ${info.channel} ${info.challenge} ${info.appName}`)
        this.exchangeDataHyperdbKeys(info.channel, info.challenge, info.appName)

        break

      default:
        break
    }
  }

  async exchangeProfilesKey (channel, challenge) {
    const initalMessage = JSON.stringify({
      msg: 'sendProfilesKey',
      challenge: challenge,
      key: this.masqProfiles.key.toString('hex')
    })

    const _handleData = async (sw, peer, data, name = '') => {
      const json = JSON.parse(data)
      switch (json.msg) {
        case 'replicationProfilesStarted':
          this._startReplication(this.masqProfiles, 'profiles')
          break
        default:
          console.log('The message type is false.')
          break
      }
    }
    this._initSwarmWithDataHandler(channel, _handleData, initalMessage)
  }

  _initSwarmWithDataHandler (channel, dataHandler, initalMessage) {
    // Subscribe to channel for a limited time to sync with masq
    debug(`I create a hub with the channel ${channel}`)
    const hub = signalhub(channel, [this.hubURL])
    let sw = null

    if (swarm.WEBRTC_SUPPORT) {
      sw = swarm(hub)
    } else {
      sw = swarm(hub, { wrtc: require('wrtc') })
    }

    sw.on('peer', (peer, id) => {
      debug(`The peer ${id} join us...`)
      if (initalMessage) { peer.send(initalMessage) }
      peer.on('data', data => dataHandler(sw, peer, data))
    })

    sw.on('close', () => {
      hub.close()
    })

    sw.on('disconnect', (peer, id) => {
      sw.close()
    })
  }

  async exchangeDataHyperdbKeys (channel, challenge, name) {
    const key = await this.createAppDb(name)
    const initalMessage = JSON.stringify({
      msg: 'sendDataKey',
      challenge: challenge,
      key: key.toString('hex')
    })

    const _handleData = async (sw, peer, data) => {
      const json = JSON.parse(data)
      switch (json.msg) {
        case 'requestWriteAccess':
        // store local key for authorized test
          this.localKey = Buffer.from(json.key, 'hex')
          await this.authorize(this.dbs[name], Buffer.from(json.key, 'hex'))
          debug(`name : ${name}`)
          this._startReplication(this.dbs[name], name)
          peer.send(JSON.stringify({
            msg: 'ready'
          }))
          break
        default:
          console.log('The message type is false.')
          break
      }
    }
    this._initSwarmWithDataHandler(channel, _handleData, initalMessage)
  }

  _startReplication (db, name) {
    debug(`Start replication for ${name}`)
    const discoveryKey = db.discoveryKey.toString('hex')
    this.hubs[name] = signalhub(discoveryKey, [this.hubURL])
    const hub = this.hubs[name]

    if (swarm.WEBRTC_SUPPORT) {
      this.sws[name] = swarm(hub)
    } else {
      this.sws[name] = swarm(hub, { wrtc: require('wrtc') })
    }
    const sw = this.sws[name]

    debug(`I am  ${sw.me}`)

    sw.on('peer', async (peer, id) => {
      debug(`The peer ${id} join us...`)
      const stream = db.replicate({ live: true })
      pump(peer, stream, peer)
    })
    if (name === 'app1') {
      debug('set watchers for POI')
      db.watch('/POI', async () => {
        this.emit('changePOI', { db: name, key: '/POI' })
      })
    }
    sw.on('close', (msg) => {
      debug(`startReplication close for ${name}`)
    })

    sw.on('disconnect', (peer, id) => {
      debug(`startReplication disconnect for ${name}`)
      debug(`The peer ${id} leave us :-| ...`)
    })
  }
  /** open and sync existing databases */
  async _openAndSyncDatabases () {
    if (!(await dbExists('masq-profiles'))) {
      return
    }
    const db = hyperdb(rai('masq-profiles'), { valueEncoding: 'json' })
    await dbReady(db)
    this.dbs.profiles = db
    this._startReplication(db, 'profiles')

    const name = 'app1'
    if (!(await dbExists(name))) {
      return
    }
    const db2 = hyperdb(rai(name), { valueEncoding: 'json' })
    await dbReady(db2)
    this.dbs[name] = db2
    this._startReplication(db2, name)
  }
}

module.exports = MasqMock
