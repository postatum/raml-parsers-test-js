const raml = require('raml-1-parser')
const amf = require('amf-client-js')
const wap = require('webapi-parser').WebApiParser

amf.plugins.document.WebApi.register()
amf.plugins.document.Vocabularies.register()
amf.plugins.features.AMFValidation.register()

async function raml1parserParse (fpath) {
  const res = raml.loadSync(fpath)
  if (res.errors.length > 0) {
    throw new Error(res.errors[0].message)
  }
  return res
}

async function amfParse (fpath) {
  const ramlParser = amf.AMF.raml10Parser()
  await amf.Core.init()
  const baseUnit = await ramlParser.parseFileAsync(`file://${fpath}`)
  const validations = await amf.AMF.validate(
    baseUnit, amf.ProfileNames.RAML, amf.ProfileNames.AMFStyle)
  validations.results.map(res => {
    if (!res.conforms && res.level.toLowerCase() === 'violation') {
      throw new Error(res.message)
    }
  })
}

async function webapiParserParse (fpath) {
  const model = await wap.raml10.parse(`file://${fpath}`)
  const report = await wap.raml10.validate(model)
  report.results.map(res => {
    if (!res.conforms && res.level.toLowerCase() === 'violation') {
      throw new Error(res.message)
    }
  })
}

module.exports = {
  raml1parserParse: raml1parserParse,
  amfParse: amfParse,
  webapiParserParse: webapiParserParse
}
