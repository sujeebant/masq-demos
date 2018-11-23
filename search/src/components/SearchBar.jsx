import React from 'react'
import Downshift from 'downshift'

import Search from '../icons/Search'

export default class SearchBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      query: ''
    }
    this.openQwant = this.openQwant.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.inputRef = React.createRef()
  }

  componentDidMount () {
    this.inputRef.current.focus()
  }

  openQwant () {
    window.open('https://www.qwant.com/?q=' + this.state.query)
  }

  handleKeyPress (e) {
    if (e.key !== 'Enter') { return }

    if (this.props.onSearch) {
      this.props.onSearch(this.state.query)
    }
    this.openQwant()
  }

  render () {
    return (
      <Downshift
        onStateChange={({ inputValue }) => {
          return inputValue && this.setState({ query: inputValue })
        }}
        selectedItem={this.state.query}
        render={({
          getInputProps,
          getItemProps,
          isOpen,
          inputValue,
          highlightedIndex,
          selectedItem
        }) => (
          <div className='SearchBar'>
            <div>
              <input {...getInputProps({
                onKeyUp: this.handleKeyPress
              })} className='input' ref={this.inputRef} placeholder='What are you looking for?' />
              <Search onClick={this.openQwant} className='icon' />
            </div>

            {isOpen &&
              <div className='downshift'>
                {this.props.items
                  .filter(i => !inputValue || i.includes(inputValue))
                  .map((item, index) => (
                    <div
                      className='downshiftRow'
                      {...getItemProps({
                        key: index,
                        index,
                        item,
                        style: {
                          backgroundColor: highlightedIndex === index ? 'lightgray' : 'white',
                          fontWeight: selectedItem === item ? 'bold' : 'normal'
                        }
                      })}
                    >
                      {item}
                    </div>
                  ))}
              </div>
            }
          </div>
        )}
      />
    )
  }
}
