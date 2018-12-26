import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { ReactComponent as Trash } from './trash.svg'

import './App.css'

const ITEMS = ['item 1', 'item 2', 'item 3']

function Item ({ item, onClickTrash }) {
  return (
    <div className='Item uk-card uk-card-default uk-card-small uk-card-body'>
      <div className='content'>
        <input className='uk-checkbox' type='checkbox' />
        {item}
        <Trash className='Trash' onClick={onClickTrash} />
      </div>
    </div>
  )
}

Item.propTypes = {
  item: PropTypes.string.isRequired,
  onClickTrash: PropTypes.func
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = { items: ITEMS.slice(), item: '' }
    this.handleClickTrash = this.handleClickTrash.bind(this)
  }

  handleChange (event) {
    this.setState({ item: event.target.value })
  }

  handleSubmit (event) {
    event.preventDefault()

    if (!this.state.item.length) { return }

    this.setState({
      item: '',
      items: [ ...this.state.items, this.state.item ]
    })
  }

  handleClickTrash (index) {
    this.setState({
      items: this.state.items.filter((item, i) => i !== index)
    })
  }

  render () {
    const { items } = this.state

    return (
      <div className='App'>
        <nav className='uk-navbar-container uk-margin'>
          <div className='uk-navbar-left'>
            <a className='uk-navbar-item uk-logo' href='#'>Masq todo list</a>
          </div>
        </nav>

        {items.map((item, i) => (
          <Item key={i} item={item} onClickTrash={() => this.handleClickTrash(i)} />)
        )}

        <form onSubmit={this.handleSubmit}>
          <input
            className='uk-input uk-form-width-large'
            type='text'
            placeholder='new item'
            onChange={this.handleChange}
          />
          <button
            className='uk-button uk-form-width-small uk-button-primary'
            type='submit'
            onSubmit={this.handleSubmit}
          >Button
          </button>
        </form>
      </div>
    )
  }
}

export default App
