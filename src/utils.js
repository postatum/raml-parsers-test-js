const os = require('os')
const path = require('path')
const { execSync } = require('child_process')
const rimraf = require('rimraf')
const walk = require('walk')

function cloneTckRepo () {
  const repoDir = path.join(os.tmpdir(), 'raml-tck')
  rimraf.sync(repoDir)
  console.log('Cloning raml-tck to', repoDir)
  execSync('git clone git@github.com:raml-org/raml-tck.git ' + repoDir)
  return path.join(repoDir, 'tests', 'raml-1.0')
}

function listRamls (fpath) {
  let files = []
  const options = {
    listeners: {
      file: (root, fileStats, next) => {
        if (fileStats.name.indexOf('.raml') >= 0) {
          files.push(path.join(root, fileStats.name))
        }
        next()
      }
    }
  }
  walk.walkSync(fpath, options)
  return files
}

function shouldFail (fpath) {
  return fpath.toLowerCase().indexOf('invalid') >= 0
}

module.exports = {
  cloneTckRepo: cloneTckRepo,
  listRamls: listRamls,
  shouldFail: shouldFail
}
