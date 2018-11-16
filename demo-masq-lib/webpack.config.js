var path = require('path')

module.exports = {
  entry: {
    masqMock: './dist/masq/masq.js',
    masqApp: './dist/app/app.js'
  },
  output: {
    filename: './[name].bundle.js'
  }
}
