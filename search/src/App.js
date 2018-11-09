import React, { Component } from 'react'
import './App.css'
import SearchBar from './components/SearchBar'
import Masq from 'masq-lib'

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
    this.masq = new Masq()
  }

  async onSearch (query) {
    console.log('query:', query)
    console.log(this.db)
    // this.db.put(query, 'ok', (err) => {
    //   if (err) return console.error(err)
    // })
    const profiles = await this.masq.getProfiles()
    console.log('profiles', profiles)
  }

  async componentDidMount () {
    console.log(this.masq)
    // await this.masq.init()
    const link = 'http://localhost:3000/' + this.masq._getLink()
    console.log('link', link)
    await this.masq.requestMasqAccess()
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
