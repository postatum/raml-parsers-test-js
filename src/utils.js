const os = require('os')
const path = require('path')
const Git = require('nodegit')
const rimraf = require('rimraf')
const walk = require('walk')

function cloneTckRepo () {
  const exDir = path.join(os.tmpdir(), 'raml-tck')
  rimraf(exDir)
  console.log('Cloning raml-tck to ', exDir)
  return Git.Clone('git@github.com:raml-org/raml-tck.git', os.tmpdir())
    .then(() => {
      return exDir
    })
}

function listRamls (fpath) {
  return walk.walkSync(fpath)
}

module.exports = {
  'cloneTckRepo': cloneTckRepo,
  'listRamls': listRamls
}
