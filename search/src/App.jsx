import React, { Component } from 'react'
import Masq from 'masq-lib'

import SearchBar from './components/SearchBar'
import Profiles from './components/Profiles'

import './App.css'
import * as config from './config/config'

const APP = {
  name: 'Qwant Search',
  description: 'Qwant search engine',
  image: 'https://qwant.com/img/v4/home-banner.svg?1542966874062'
}

// function ConnectionStatus ({ isConnected }) {
//   return isConnected
//     ? <p style={{ color: 'green' }}>Connected to Masq</p>
//     : <p style={{ color: 'red' }}>Disconnected from Masq</p>
// }

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      link: '#',
      items: [],
      profiles: []
    }

    this.masq = null
    this.onSearch = this.onSearch.bind(this)
    this.handleClickProfile = this.handleClickProfile.bind(this)
  }

  async componentDidMount () {
    this.masq = new Masq('Search', config.HUB_URLS)
    await this.masq.init()

    try {
      const profiles = await this.masq.getProfiles()
      this.setState({ profiles })
    } catch (e) {
      // We need to link with masq for the first time

      // Retrieve link to request an access to Masq
      const { link } = await this.masq.requestMasqAccess()
      this.setState({ link })
      // Waith for the operation to complete
      await this.masq.requestMasqAccessDone()

      // We can now retrieve the profiles
      const profiles = await this.masq.getProfiles()
      this.setState({ profiles })
    }
  }

  async onSearch (query) {
    const items = [...this.state.items, query]

    try {
      // We create one key in DB per search item instead
      // of updating an array
      await this.masq.put(query, 'ok')
      this.setState({ items })
    } catch (e) {
      console.error(e.message)
    }
  }

  async handleClickProfile (profile) {
    let db = null
    this.setState({ currentProfile: profile })

    await this.masq.setProfile(profile.id)

    try {
      db = this.masq._getDB()
    } catch (e) {
      // Retrieve link to create the app
      const { link } = await this.masq.exchangeDataHyperdbKeys(APP)
      window.open(link, '_blank')
      // Wait for the operation to complete
      await this.masq.exchangeDataHyperdbKeysDone(APP)
      db = this.masq._getDB()
    }

    // Retrieve existing keys, in order to
    // retrieve items from the values stored in the DB
    db.list('', (err, list) => {
      if (err) console.error(err)
      const items = list.map(nodes => nodes[0].key)
      this.setState({ items })
    })
  }

  render () {
    const { profiles, items, currentProfile, link } = this.state
    return (
      <div className='App'>
        {!profiles.length && <a target='_blank' rel="noopener noreferrer" href={link}>connect to masq</a>}
        <Profiles profiles={profiles} onClick={this.handleClickProfile} />
        {currentProfile && <p>Selected user: {currentProfile.username}</p>}
        {currentProfile && <SearchBar onSearch={this.onSearch} items={items} />}
      </div>
    )
  }
}

export default App
