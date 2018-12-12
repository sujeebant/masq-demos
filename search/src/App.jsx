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
      link: '#'
    }

    this.masq = null
    this.onSearch = this.onSearch.bind(this)
    this.handleClickLogin = this.handleClickLogin.bind(this)
    this.handleClickLogout = this.handleClickLogout.bind(this)
    this.getAllQueriesFromDB = this.getAllQueriesFromDB.bind(this)
  }

  getAllQueriesFromDB () {
    const db = this.masq._getDB()

    // Retrieve existing keys, in order to
    // retrieve items from the values stored in the DB
    db.list((err, list) => {
      if (err) console.error(err)
      const items = list.map(nodes => nodes[0].key)
      this.setState({ items })
    })
  }

  async componentDidMount () {
    this.masq = new Masq(APP.name, APP.description, APP.imageURL)

    try {
      const { link } = await this.masq.logIntoMasq(true)
      this.setState({ link })
      this.setState({ loggedIn })
      this.getAllQueriesFromDB()
    } catch (err) {
      this.setState({ err })
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

  async handleClickLogin () {
    try {
      await this.masq.logIntoMasqDone()
      this.setState({ loggedIn: true })
      this.getAllQueriesFromDB()
    } catch (e) {
      console.error(e)
    }
  }

  async handleClickLogout () {
    this.setState({ loggedIn: false })
    await this.masq.signout()
  }

  render () {
    const { items, loggedIn, link } = this.state
    return (
      <div className='App'>
        {!loggedIn && (
          <a
            href={link}
            target='_blank'
            rel="noopener noreferrer"
            onClick={this.handleClickLogin}
          >Log Into Masq
          </a>
        )}
        {loggedIn && <a href='#' onClick={this.handleClickLogout}>Logout</a>}
        <SearchBar onSearch={this.onSearch} items={items} />
      </div>
    )
  }
}

export default App
