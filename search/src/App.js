import React, { Component } from 'react'
import './App.css'

import SearchBar from './components/SearchBar'

import { Client } from 'masq-client'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = { items: [] }
    this.client = null
    this.onSearch = this.onSearch.bind(this)
  }

  async onSearch (query) {
    console.log('query:', query)
    let occurences = (await this.client.getItem(query)) || 0
    await this.client.setItem(query, occurences + 1)

    if (occurences > 0) return
    let items = this.state.items.slice()
    items.push(query)
    this.setState({
      items: items
    })
  }

  async componentDidMount () {
    const appInfo = {
      url: 'https://masq.io/search',
      name: 'Masq Search',
      description: 'Simple search engine using qwant.com'
    }
    const settings = {
      socketUrl: 'ws://localhost:8080',
      socketConf: { requestTimeout: 0 }
    }

    try {
      const token = window.localStorage.getItem('token')
      if (token) {
        settings['authToken'] = token
      }

      this.client = new Client(settings)
      await this.client.initWS()

      if (!token) {
        // Register the app and save the returned token
        const token = await this.client.addApp(appInfo)
        window.localStorage.setItem('token', token)
      }

      // Get Search history
      const keys = (await this.client.listKeys())
      this.setState({
        items: keys
      })

      console.log('keys:', keys)
    } catch (err) {
      if (err.status === 403) {
        window.localStorage.removeItem('token')
      }
      console.error(err)
    }
  }

  render () {
    return (
      <div className='App'>
        <SearchBar onSearch={this.onSearch} items={this.state.items} />
      </div>
    )
  }
}

export default App
