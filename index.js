// Set Babel Configuration
require('babel-register')({
  presets: ['es2015', 'es2016', 'es2017', 'stage-0']
})

require('./loader');