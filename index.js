// Set Babel Configuration
require('babel-register')({
  presets: ['es2015', 'es2016', 'es2017', 'stage-0'],
  plugins: ["transform-runtime", "transform-async-to-generator", "syntax-async-functions"]
})

require('./loader');