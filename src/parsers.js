const raml = require('raml-1-parser')

function raml1parserParse (fpath) {
  raml.loadSync(fpath)
}

module.exports = {
  raml1parserParse: raml1parserParse
}
