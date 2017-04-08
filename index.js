const _ = require('lodash')
const Promise = require('bluebird')
const Finder = require('glob')
const Path = require('path')
const Hoek = require('hoek')

/**
 * Loads handlers for an API server.
 * @param {Object} server The hapi server Object
 * @param {Object} pluginOptions Plugin options to send to module initializers
 * @param {String} glob The specification of where to load files from
 * @param {Object} globOptions Options to send to the Finder ('glob' package)
 * @returns A promise that resolves to a concatenated array of routes provided
 * loaded modules.
 */

exports.loadHandlers =
  function loadHandlers(server, pluginOptions, glob, globOptions) {
    Hoek.assert(server, 'server is required')
    Hoek.assert(glob, 'glob (file location) is required')
    var options = globOptions || {}
    var self = this
    return new Promise((resolve, reject) => {
        return new Finder(glob, options, (error, filenames) => {
          if (error) {
            reject(error)
          } else {
            resolve(initFiles(filenames))
          }
        })
      })
      /**
       * Given an array of filenames, loads each file by requiring it and calling
       * its initialize method, and then concatenates route specifications to exports.routes
       * @param {Array} filenames The filenames that satisfy the glob passed to loadHandlers
       * @returns {Object} A promise that resolves to the route list with loaded route definitions
       */
    function initFiles(filenames) {
      var loadedRoutes = []
        // load the modules
      var dir = options.cwd || __dirname
      var loadedModules = _.map(filenames, (filename) => {
          // only save one copy of modules, so we don't register its routes twice
          var moduleDef = {
            path: Path.join(dir, filename)
          }
          moduleDef.module = require(moduleDef.path)
          return moduleDef
        })
        // initialize each module that has an initialize method
      return Promise.map(loadedModules, (moduleDef) => {
          if (!filenames || filenames.length === 0) {
            return Promise.reject(new Error('no files found with specifier: ' + glob))
          }
          if (moduleDef.module.initialize) {
            return moduleDef.module.initialize.call(self, server, pluginOptions)
          }
        })
        // then combine routes from each module into exports.routes
        .then(() => {
          _.each(loadedModules, (moduleDef) => {
            if (moduleDef.module.routes) {
              loadedRoutes = loadedRoutes.concat(moduleDef.module.routes)
            }
          })
        }).then(() => {
          return Promise.resolve(loadedRoutes)
        })
    }
  }

exports.register = function(server, options, next) {
  // save options and the prefix for use by this instance of the plugin
  var context = {
    options: options,
    prefix: server.realm.modifiers.route.prefix
  }
  server.bind(context)
  return exports.loadHandlers.call(this, server, options, 'lib/*.js', {
      cwd: __dirname
    })
    .then((routes) => {
      server.route(routes)
      return next()
    })
    .catch((error) => {
      next(error)
    })
}

exports.register.attributes = {
  multiple: true,
  pkg: require('./package.json')
}