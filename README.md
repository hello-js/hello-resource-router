# hello-resource-router

[![Version](https://img.shields.io/npm/v/hello-resource-router.svg?style=flat-square)](https://www.npmjs.com/package/hello-resource-router)
[![Dependency Status](https://img.shields.io/david/hello-framework/hello-resource-router.svg?style=flat-square)](https://david-dm.org/hello-framework/hello-resource-router)
[![Build Status](https://img.shields.io/travis/hello-framework/hello-resource-router/master.svg?style=flat-square)](https://travis-ci.org/hello-framework/hello-resource-router)
[![Coverage Status](https://coveralls.io/repos/github/hello-framework/hello-resource-router/badge.svg?branch=master)](https://coveralls.io/github/hello-framework/hello-resource-router?branch=master)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Downloads](https://img.shields.io/npm/dm/hello-resource-router.svg?style=flat-square)](https://www.npmjs.com/package/hello-resource-router)

`hello-resource-router` is build upon the popular [koa-router](https://github.com/alexmingoia/koa-router/tree/master/) package
and extended to include resource routing (much like Rails' router) which map to standard CRUD operations.

## Installation

Install via yarn or npm:

```
yarn add hello-resource-router
```

or

```
npm install hello-resource-router --save
```

## Usage

Usage for `hello-resource-router` is exactly the same as the usage for [koa-router](https://github.com/alexmingoia/koa-router/tree/master/),
with an added method called `resources`.

By default, `hello-resource-router` maps a `resource` to the default 7 methods on a controller:

* `index`
* `new`
* `show`
* `create`
* `edit`
* `update` (via PUT and PATCH)
* `destroy`

The router attempts to be *smart* by checking if those methods exist. If any of them do not exist,
an HTTP status of `501 Not Implemented` will be returned to the client.
### Default behavior:

```js
const Router = require('hello-resource-router')

let router = new Router()
router.resrouces('users', controller)
```

This creates the following routes:

| Route                 | Controller Method  |
|-----------------------|--------------------|
| `GET /users`          | `index`            |
| `GET /users/new`      | `new`              |
| `GET /users/:id`      | `show`             |
| `POST /users`         | `create`           |
| `GET /users/:id/edit` | `edit`             |
| `PUT /users/:id`      | `update`           |
| `PATCH /users/:id`    | `update`           |
| `DELETE /users/:id`   | `destroy`          |

## API

`router.resources(path, [middleware], controller, [options])`

* `path` {String} - The base path for the router
* `middleware` {Array of functions} - Optional List of middleware.
* `controller` {Controller} - The controller containing the CRUD methods
* `opts` {Object} - Optional
    * `except` {Array|String} - Optional. An action or list of actions to exclude from the resource routing. Note: `only` takes precendence over `except`
    * `only` {Array|String} - Optional. A action or list of actions to include in the resource routing. Note: `only` takes precendence over `except`
    * `param` {String} - Optional. The parameter name to use, by default it is `id` (accessed by `ctx.params.id`)
    * `api` {Boolean} - Optional. If set to true, this will generate API-only routes, excluding `new` and `edit`. [Default: false]

## Examples

#### Example 1:

```js
let router = new Router()
router.resources('users', controller.Users)
// GET /users
// GET /users/new
// GET /users/:id
// GET /users/:id/edit
// POST /users
// PUT /users/:id
// PATCH /users/:id
// DELETE /users/:id
```

#### Example 2:

```js
let router = new Router()
router.resources('users', controller.Users, { only: ['index', 'show'] })
// GET /users
// GET /users/:id
```

#### Example 3:

```js
let router = new Router()
router.resources('users', controller.Users, { only: 'show' })
// GET /users/:id
```

#### Example 4:

```js
let router = new Router()
router.resources('users', controller.Users, { except: ['index', 'show', 'new', 'edit'] })
// POST /users
// PUT /users/:id
// PATCH /users/:id
// DELETE /users/:id
```

#### Example 5:

```js
let router = new Router()
router.resources('users', controller.Users, { except: 'destroy' })
// GET /users
// GET /users/new
// GET /users/:id
// GET /users/:id/edit
// POST /users
// PUT /users/:id
// PATCH /users/:id
```

#### Example 6:

```js
let router = new Router()
router.resources('users', controller.Users, { api: true })
// GET /users
// GET /users/:id
// POST /users
// PUT /users/:id
// PATCH /users/:id
// DELETE /users/:id

// NOTE: This call is the same as:
router.resources('users', controller.Users, { except: ['new', 'edit'] })
```
