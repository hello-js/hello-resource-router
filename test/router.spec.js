'use strict'

const _ = require('lodash')
const expect = require('chai').expect
const Koa = require('koa')
const request = require('supertest')
const Router = require('../lib')

const user1 = {
  id: 1,
  name: 'User 1'
}
const user2 = {
  id: 2,
  name: 'User 2'
}

const controller = {
  index: (ctx) => {
    ctx.body = { users: [user1, user2] }
  },
  show: (ctx) => {
    ctx.body = { user: user1 }
  },
  create: (ctx) => {
    ctx.body = { user: user2 }
    ctx.status = 201
  },
  update: (ctx) => {
    ctx.body = { user: user1 }
  },
  destroy: (ctx) => {
    ctx.status = 204
  }
}

describe('Router', function () {
  let app
  let router

  beforeEach(function () {
    app = new Koa()
    router = new Router()
  })

  describe('#resources', function () {
    describe('defaults', function () {
      beforeEach(function () {
        router.resources('users', controller)

        app.use(router.routes())
      })

      it('handles the GET #index method', function () {
        return request(app.listen())
          .get('/users')
          .expect(200)
          .then(function (res) {
            expect(res.body).to.deep.equal({
              users: [
                user1,
                user2
              ]
            })
          })
      })

      it('handles the GET #show method', function () {
        return request(app.listen())
          .get('/users/1')
          .expect(200)
          .then(function (res) {
            expect(res.body).to.deep.equal({
              user: user1
            })
          })
      })

      it('handles the POST #create method', function () {
        return request(app.listen())
          .post('/users')
          .expect(201)
          .then(function (res) {
            expect(res.body).to.deep.equal({
              user: user2
            })
          })
      })

      it('handles the PUT #update method', function () {
        return request(app.listen())
          .put('/users/1')
          .expect(200)
          .then(function (res) {
            expect(res.body).to.deep.equal({
              user: user1
            })
          })
      })

      it('handles the PATCH #update method', function () {
        return request(app.listen())
          .patch('/users/1')
          .expect(200)
          .then(function (res) {
            expect(res.body).to.deep.equal({
              user: user1
            })
          })
      })

      it('handles the DELETE #destroy method', function () {
        return request(app.listen())
          .del('/users/1')
          .expect(204)
      })
    })

    describe('with middleware', function () {
      it('includes the middleware', function () {
        class Controller2 {
          static show (ctx) {
            ctx.status = 200
          }
        }
        let middleware = function (ctx, next) {
          ctx.body = 'Middleware'
          return next()
        }

        router.resources('users', middleware, Controller2)
        app.use(router.routes())

        return request(app.listen())
          .get('/users/1')
          .expect(200)
          .then(function (res) {
            expect(res.text).to.equal('Middleware')
          })
      })
    })

    describe('with missing controller methods', function () {
      it('treats undefined routes on the controller with 501', function () {
        router.resources('users', _.omit(controller, 'show'))
        app.use(router.routes())

        return request(app.listen())
          .get('/users/1')
          .expect(501)
      })
    })

    describe('using the `only` option', function () {
      beforeEach(function () {
        class Controller {
          static show (ctx) {
            ctx.status = 200
          }

          static index (ctx) {
            ctx.status = 200
          }
        }

        router.resources('users', Controller, { only: 'show' })
        app.use(router.routes())
      })

      it('handles the `only` route', function () {
        return request(app.listen())
          .get('/users/1')
          .expect(200)
      })

      it('treats other routes excluded via the `only` option with a 404', function () {
        return request(app.listen())
          .get('/users')
          .expect(404)
      })
    })

    describe('using the `except` option', function () {
      beforeEach(function () {
        router.resources('users', controller, { except: ['index', 'create', 'update', 'destroy'] })
        app.use(router.routes())
      })

      it('handles the routes not excluded by the `except` option', function () {
        return request(app.listen())
          .get('/users/1')
          .expect(200)
      })

      it('treats other routes in the `except` option with a 404', function () {
        return request(app.listen())
          .get('/users')
          .expect(404)
      })
    })
  })
})
