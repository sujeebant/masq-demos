import React from 'react'

import Search from '../icons/Search'

const styles = {
  SearchBar: {
    position: 'absolute',
    top: '50%',
    width: 480,
    height: 56,
    left: '50%',
    marginLeft: -240,
    marginTop: -56,
    borderBottom: '2px solid #747474'
  },
  input: {
    width: 384,
    height: 32,
    fontSize: 28,
    border: 0,
    outline: 0,
    float: 'left',
    color: '#747474'
  },
  icon: {
    width: 42,
    height: 42,
    float: 'right',
    color: '#747474',
    cursor: 'pointer'
  }
}

export default function SearchBar (props) {
  return (
    <form style={styles.SearchBar}>
      <input style={styles.input} placeholder='What are you looking for?' />
      <Search style={styles.icon} />
    </form>
  )
}
