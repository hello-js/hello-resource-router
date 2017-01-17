'use strict'

const _ = require('lodash')
const KoaRouter = require('koa-router')

/**
 * The Router class is a wrapper over koa-router extended to include simple support for RESTful
 * controllers via the `resources` method.
 */
class Router extends KoaRouter {

  /**
   * Generate RESTful routes for a given controller
   *
   * @example
   * let router = new Router()
   * router.resources('users', controller.Users)
   * // GET /users
   * // GET /users/:id
   * // POST /users
   * // PUT /users/:id
   * // DELETE /users/:id
   *
   * @example
   * let router = new Router()
   * router.resources('users', controller.Users, { only: ['index', 'show'] })
   * // GET /users
   * // GET /users/:id
   *
   * @example
   * let router = new Router()
   * router.resources('users', controller.Users, { only: 'show' })
   * // GET /users/:id
   *
   * @example
   * let router = new Router()
   * router.resources('users', controller.Users, { except: ['index', 'show'] })
   * // POST /users
   * // PUT /users/:id
   * // DELETE /users/:id
   *
   * @example
   * let router = new Router()
   * router.resources('users', controller.Users, { except: 'destroy' })
   * // GET /users
   * // GET /users/:id
   * // POST /users
   * // PUT /users/:id
   *
   * @param {string} path - The base path for the router
   * @param {Array|Function} [middleware] - List of middleware
   * @param {Controller} controller - The controller for the resource
   * @param {Object} [opts] - Optional configuration options for the resource
   * @param {Array|String} [opts.except] - An action or list of actions to exclude from the resource routing. Note: `only` takes precendence over `except`
   * @param {Array|String} [opts.only] - A action or list of actions to include in the resource routing. Note: `only` takes precendence over `except`
   * @param {String} [opts.param] - The named parameter to use in the route (default: `id`)
   * @returns {Router} - The current Router instance (`this`)
   */
  resources () {
    let args = Array.prototype.slice.call(arguments)
    let path = args.shift()
    let routes = ['index', 'show', 'create', 'update', 'destroy']
    let opts = {}
    let param = 'id'
    let controller
    let middleware

    if (!path.startsWith('/')) {
      path = `/${path}`
    }

    if (argumentsContainOptions(args)) {
      opts = args.pop()
    }
    controller = args.pop()
    middleware = args

    if (opts.only) {
      routes = _.flattenDeep([opts.only])
    } else if (opts.except) {
      routes = _.difference(routes, _.flattenDeep([opts.except]))
    }

    if (opts.param) {
      param = opts.param
    }

    if (_.includes(routes, 'index')) {
      this.get.apply(this, [path].concat(middleware, [controllerMethod(controller, 'index')]))
    }

    if (_.includes(routes, 'show')) {
      this.get.apply(this, [`${path}/:${param}`].concat(middleware, [controllerMethod(controller, 'show')]))
    }

    if (_.includes(routes, 'create')) {
      this.post.apply(this, [path].concat(middleware, [controllerMethod(controller, 'create')]))
    }

    if (_.includes(routes, 'update')) {
      this.put.apply(this, [`${path}/:${param}`].concat(middleware, [controllerMethod(controller, 'update')]))
      this.patch.apply(this, [`${path}/:${param}`].concat(middleware, [controllerMethod(controller, 'update')]))
    }

    if (_.includes(routes, 'destroy')) {
      this.delete.apply(this, [`${path}/:${param}`].concat(middleware, [controllerMethod(controller, 'destroy')]))
    }

    return this
  }
}

/**
 * Determine if the arguments list contains a trailing `opts` object.
 * Possible combinations are as below (f = function, c = class, a = array, o = object)
 *
 * a(middleware), c(controller), o(opts)   => true
 * a(middleware), o(controller), o(opts)   => true
 * f(middleware), c(controller), o(opts)   => true
 * f(middleware), o(controller), o(opts)   => true
 *
 * a(middleware), c(controller)            => false
 * a(middleware), o(controller)            => false
 * f(middleware), c(controller)            => false
 * f(middleware), o(controller)            => false
 *
 * c(controller), o(opts)                  => true
 * o(controller), o(opts)                  => true
 *
 * c(controller)                           => false
 * o(controller)                           => false
 *
 * @returns {Boolean} - Whether the args array contains a trailing opts object
 */
function argumentsContainOptions (args) {
  if (args.length === 3) {
    return true
  }

  if (args.length !== 2) {
    return false
  }

  if (_.isArray(args[0])) { // middleware array
    return false
  }

  if (_.isFunction(args[0]) && !isClass(args[0])) { // middleware function
    return false
  }

  return true
}

function isClass (fn) {
  return _.isFunction(fn) && /^class\s/.test(Function.prototype.toString.call(fn))
}

function controllerMethod (controller, method, handleNotImplemented) {
  return controller && controller[method] || notImplemented
}

function notImplemented (ctx) {
  ctx.status = 501
}

module.exports = Router
