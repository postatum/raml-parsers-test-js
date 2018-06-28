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
    console.log('Not supported parser: ', argv.parser)
    return
  }

  return utils.cloneTckRepo()
    .then((exDir) => {
      const fileList = utils.listRamls(exDir)
      _.forEach(fileList, (fpath) => {
        console.log('> Parsing ', fpath, ': ')
        try {
          parserFunc(fpath)
          console.log('OK')
        } catch (e) {
          console.log('FAIL')
          if (verbose) {
            console.log(e)
          }
        }
      })
    })
}

main()
