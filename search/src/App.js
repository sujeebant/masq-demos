import React, { Component } from 'react'
import './App.css'

import SearchBar from './components/SearchBar'

import { Client } from './masq/client'

class App extends Component {
  onSearch (query) {
    console.log('query:', query)
  }

  async componentDidMount () {
    const appInfo = {
      url: 'https://masq.io/search',
      name: 'Masq Search',
      description: 'Masq Search'
    }
    try {
      const client = new Client({
        socketUrl: 'ws://localhost:8080',
        socketConf: { requestTimeout: 0 }
      })
      await client.initWS()
      await client.addApp(appInfo)
      await client.setItem('key', 'value')
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    return (
      <div className='App'>
        <SearchBar onSearch={this.onSearch} />
      </div>
    )
  }
}

export default App
