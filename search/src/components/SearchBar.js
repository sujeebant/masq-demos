import React from 'react'

import Search from '../icons/Search'

export default function SearchBar (props) {
  const styles = {
    SearchBar: {
      width: 480,
      height: 56,
      margin: 'auto',
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
  return (
    <form style={styles.SearchBar}>
      <input style={styles.input} placeholder='What are you looking for?' />
      <Search style={styles.icon} />
    </form>
  )
}
