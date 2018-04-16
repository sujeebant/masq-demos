import React, { Component } from 'react'
import './App.css'

import SearchBar from './components/SearchBar'

class App extends Component {
  render () {
    return (
      <div className='App'>
        {/* <header className='App-header'>
          <h1 className='App-title'>Masq Demo - Search</h1>
        </header> */}
        <SearchBar />
      </div>
    )
  }
}

export default App
