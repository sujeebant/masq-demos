import React, { Component } from 'react'
import './App.css'

import SearchBar from './components/SearchBar'

class App extends Component {
  onSearch (query) {
    console.log('query:', query)
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
