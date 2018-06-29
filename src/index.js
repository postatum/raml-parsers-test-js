const parseArgs = require('minimist')
const _ = require('lodash')
const parsers = require('./parsers')
const utils = require('./utils')

const PARSERS = {
  'ramlfications': parsers.ramlficationsParse,
  'raml1parser': parsers.raml1parserParse
}

function main () {
  const argv = parseArgs(process.argv.slice(2))
  const verbose = argv.verbose || false
  const parserFunc = PARSERS[argv.parser]
  if (parserFunc === undefined) {
    console.log('Not supported parser:', argv.parser)
    return
  }

  const exDir = utils.cloneTckRepo()
  const fileList = utils.listRamls(exDir)
  _.forEach(fileList, (fpath) => {
    console.log('> Parsing ' + fpath + ': ')
    let success = true
    let error
    try {
      parserFunc(fpath)
    } catch (e) {
      success = false
      error = e
    }
    if (utils.shouldFail(fpath)) {
      success = !success
    }
    if (success) {
      console.log('OK')
    } else {
      console.log('FAIL')
      if (verbose) {
        console.log(error)
      }
    }
  })
}

main()
