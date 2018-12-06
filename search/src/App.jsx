import React, { Component } from 'react'
import Masq from 'masq-lib'

import SearchBar from './components/SearchBar'

import './App.css'

const APP = {
  name: 'Qwant Search',
  description: 'Qwant Search app integrated with Masq',
  image: 'https://qwant.com/img/v4/home-banner.svg?1542966874062',
  imageURL: 'https://fr.wikipedia.org/wiki/Qwant#/media/File:Qwant_new_logo_2018.svg'
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
      items: [],
      loggedIn: null,
      err: null,
      logginIn: false
    }

    this.masq = null
    this.onSearch = this.onSearch.bind(this)
    this.handleClickLogin = this.handleClickLogin.bind(this)
  }

  async componentDidMount () {
    this.masq = new Masq(APP.name, APP.description, APP.imageURL)
    const loggedIn = this.masq.isLoggedIn()
    if (loggedIn) {
      try {
        await this.masq.connectToMasq()
        this.setState({ loggedIn })
        const items = await this.masq.get('queryList')
        this.setState({ items })
      } catch (err) {
        this.setState({ err })
      }
    }
  }

  async onSearch (query) {
    const items = [...this.state.items, query]
    this.setState({ items })

    if (this.masq.isConnected()) {
      this.syncSearchItemsWithMasq()
    }
  }

  async syncSearchItemsWithMasq () {
    try {
      // We create one key in DB per search item instead
      // of updating an array
      await this.masq.put('queryList', this.state.items)
    } catch (e) {
      console.error(e.message)
    }
  }

  async handleClickLogin () {
    this.setState({ logginIn: true })
    const { link } = await this.masq.logIntoMasq(true)
    window.open(link, '_blank')
    this.setState({ logginIn: false, items: this.state.items })
  }

  render () {
    const { items, loggedIn } = this.state
    return (
      <div className='App'>
        {!loggedIn && <input type="button" target='_blank' rel="noopener noreferrer" onClick={this.handleClickLogin} value="Log Into Masq"></input>}
        <SearchBar onSearch={this.onSearch} items={items} />
      </div>
    )
  }
}

export default App
