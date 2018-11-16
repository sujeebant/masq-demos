const rai = require('random-access-idb')
const hyperdb = require('hyperdb')
const Masq = require('masq-lib')
const data = require('./villeDeFrance.json')

const dbName = 'testDB'
let masq = null
const channel = 'randomChannel'
const channel2 = 'randomChannel2'
const challenge = 'challenge'
const villes = data.villes

console.log(Masq)


const debug = (str) => {
  if (process.env.NODE_ENV !== 'production') console.log(str)
}

const wait = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 100)
  })
}

const isCreated = (dbName) => {
  return new Promise((resolve, reject) => {
    let req = indexedDB.open(dbName)
    let existed = true
    req.onsuccess = () => {
      req.result.close()
      // if (!existed) { indexedDB.deleteDatabase(dbName) }
      resolve(existed)
    }
    req.onupgradeneeded = () => {
      existed = false
    }
  })
}

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

/**
 * Return the value of a given key
 * @param {Object} db - The hyperdb instance
 * @param {string} key - The key
 * @returns {string|Object} - The value
 */
const get = (db, key) => {
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
const set = (db, key, value) => {
  return new Promise((resolve, reject) => {
    db.put(key, value, err => {
      if (err) reject(err)
      resolve(value)
    })
  })
}

document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('localTest')
  if (el) {
    el.addEventListener('click', function (e) {
      createLocalHyperDB()
    })
  }
  el = document.getElementById('checkDB')
  if (el) {
    el.addEventListener('click', function (e) {
      checkDB()
    })
  }
  el = document.getElementById('connectMasq')
  if (el) {
    el.addEventListener('click', function (e) {
      connectMasq()
    })
  }
  el = document.getElementById('updateMasqProfiles')
  if (el) {
    el.addEventListener('click', function (e) {
      updateMasqProfiles()
    })
  }
  el = document.getElementById('replicateData')
  if (el) {
    el.addEventListener('click', function (e) {
      replicateData()
    })
  }
  el = document.getElementById('init')
  if (el) {
    el.addEventListener('click', function (e) {
      init()
    })
  }
})

const createLocalHyperDB = async () => {
  const key = '/hello'
  const value = { data: 'world' }
  const db = hyperdb(rai(dbName), { valueEncoding: 'json' })
  await dbReady(db)

  // Only for test purpose, we overwrite the data hyperdb
  await set(db, key, value)
  const res = await get(db, '/hello')
  console.log(res)
  console.log(`Database exists : ${await isCreated(dbName)}`)
}

const checkDB = async () => {
  console.log(`${dbName} exists : ${await isCreated(dbName)}`)
}

const connectMasq = async () => {
  masq = new Masq()
  await masq.init()

  // We force channel and challenge for demo purpose

  masq.channel = channel
  masq.challenge = challenge
  masq.requestMasqAccess()
  let el = document.getElementById('receiveLinkMsgProfiles')
  el.innerHTML = ` Now, please click on receive Link in Masq in order to send the new channel name and the challenge. `
}

const updateMasqProfiles = async () => {
  debug('We get the profiles.')
  try {
    const profiles = await masq.getProfiles()
    if (!profiles) { debug('profiles is empty!') }
    let el = document.getElementById('masqProfilesReplication')
    el.innerHTML = ` Of course your are ${profiles[0].username}, your id is  ${profiles[0].id}, now click on receive link for data replication and authorization`
    masq.setProfile(profiles[0].id)
    masq.channel = channel2
    masq.exchangeDataHyperdbKeys()
  } catch (error) {
    debug('error in updateMasqProfiles')

    console.log(error)
  }
}

const replicateData = async () => {
  let el = document.getElementById('addData')
  const POI = villes[Math.floor(Math.random() * villes.length)]
  let actualPOI = await masq.get('/POI')
  if (!actualPOI) { actualPOI = [] }
  const newPOI = [...actualPOI, POI]
  el.innerHTML = ` We add a list of POI : ${JSON.stringify(newPOI)}. `

  await wait()
  try {
    debug('we add a key /POI in data hyperDb')
    await masq.put('/POI', newPOI)
  } catch (error) {
    console.log(error)
  }
}

const init = async () => {
  masq = new Masq()
  await masq.init()
  debug('Must open and sync existing databases')
  const profiles = await masq.getProfiles()
  debug(`sync dones, get profiles : ${profiles[0].username}`)
  if (profiles[0]) { masq.setProfile(profiles[0].id) }
}
