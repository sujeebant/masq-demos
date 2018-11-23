const MasqCore = require('./masq-mock')

let profile = {
  username: 'bob',
  image: 'image1'
}
const appName = 'app1'
const debug = (str) => {
  if (process.env.NODE_ENV !== 'production') console.log(str)
}
const channel = 'randomChannel'
const channel2 = 'randomChannel2'

let masqCore = null

document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('initMasqMock')
  if (el) {
    el.addEventListener('click', function (e) {
      console.log('To disable debug print, remove --mode=development from webpack command in package.json')
      initMasqMock()
    })
  }
  el = document.getElementById('receiveLinkMasqProfiles')
  if (el) {
    el.addEventListener('click', function (e) {
      receiveLinkMasqProfiles()
    })
  }
  el = document.getElementById('receiveLinkSyncData')
  if (el) {
    el.addEventListener('click', function (e) {
      receiveLinkSyncData()
    })
  }
  el = document.getElementById('init')
  if (el) {
    el.addEventListener('click', function (e) {
      init()
    })
  }
})

const initMasqMock = async () => {
  debug('initMasqMock')

  // masqCore = new MasqCore({ hubURL: 'localhost:8080' })
  masqCore = new MasqCore({ hubURL: 'wss://signalhub-jvunerwwrg.now.sh' })
  await masqCore.init()
  await masqCore.initProfiles()
  await masqCore.setProfile('bob', profile)
  const profile1 = await masqCore.getProfile('bob')
  debug(JSON.stringify(profile1))
  let el = document.getElementById('step1')
  el.innerHTML = fillElement(`Now, click on Masq Connect in app`)
}

const receiveLinkMasqProfiles = () => {
  let el = document.getElementById('checkIfProfilesSynced')
  el.innerHTML = fillElement(` Sync. of profiles is done, check the app.`)
  masqCore.receiveLink({
    type: 'syncProfiles',
    channel: channel,
    challenge: 'challenge'
  })
}

const receiveLinkSyncData = () => {
  let el = document.getElementById('addDatainApp')
  el.innerHTML = fillElement(` Now add data in app, Masq will receive the same data :-;`)
  masqCore.receiveLink({
    type: 'syncData',
    channel: channel2,
    challenge: 'challenge',
    appName: appName
  })
  masqCore.on('changePOI', async msg => {
    // check if item is replicated in masq
    const POI = await masqCore.getItem(appName, '/POI')
    let el = document.getElementById('addDatainApp')
    el.innerHTML = fillElement(` We receive: ${JSON.stringify(POI)}`)
  })
}

const init = async () => {
  masqCore = new MasqCore()
  await masqCore._openAndSyncDatabases()
  masqCore.on('changePOI', async msg => {
    // check if item is replicated in masq
    const POI = await masqCore.getItem(appName, '/POI')
    let el = document.getElementById('addDatainApp')
    el.innerHTML = fillElement(` We receive: ${JSON.stringify(POI)}`)
  })
}

const fillElement = (str) => {
  return `<h3>Output</h3><p>${str}</p>`
}
