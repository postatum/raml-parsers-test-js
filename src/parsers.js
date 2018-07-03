const raml = require('raml-1-parser')

function raml1parserParse (fpath) {
  const res = raml.loadSync(fpath)
  if (res.errors.length > 0) {
    throw new Error(res.errors[0].message)
  }
}

module.exports = {
  raml1parserParse: raml1parserParse
}
