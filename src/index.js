const parseArgs = require('minimist')
const _ = require('lodash')
const parsers = require('./parsers')
const utils = require('./utils')

const PARSERS = {
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
  let passed = 0
  _.forEach(fileList, (fpath) => {
    // Log like this to not add newline at the end
    process.stdout.write('> Parsing ' + fpath + ': ')
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
      error = 'Parsing expected to fail but succeeded'
    }
    if (success) {
      passed++
      console.log('OK')
    } else {
      console.log('FAIL')
      if (verbose) {
        console.log(error)
      }
    }
  })
  console.log('\nPassed/Total:', passed, '/', fileList.length)
}

main()
