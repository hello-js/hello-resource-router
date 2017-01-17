# koa-restful-router

`koa-restful-router` is build upon the popular [koa-router](https://github.com/alexmingoia/koa-router/tree/master/) package
and extended to include RESTful resource handling (much like Rails' router) which map to standard CRUD operations.

## Installation

Install via yarn or npm:

```
yarn add koa-restful-router
```

or

```
npm install koa-restful-router --save
```

## Usage

By default, `koa-restful-router` maps a `resource` to the default 5 CRUD methods on a controller:

* `index`
* `show`
* `create`
* `update`
* `destroy`

### Default behavior:

```js
const Router = require('koa-restful-router')

let router = new Router()
router.resrouces('users', controller)
```

This creates the following routes:

| Route               | Controller Method  |
|---------------------|--------------------|
| `GET /users`        | `index`            |
| `GET /users/:id`    | `show`             |
| `POST /users`       | `create`           |
| `PUT /users/:id`    | `update`           |
| `DELETE /users/:id` | `destroy`          |


### Disabling methods



## API

router.resources(path, [middleware], controller, [options])

* `path` {String} - The base path for the router
* `middleware` {Array of functions} - Optional List of middleware.
* `controller` {Controller} - The controller containing the CRUD methods
* `opts` {Object} - Optional
    * `except` {Array|String} - Optional. An action or list of actions to exclude from the resource routing. Note: `only` takes precendence over `except`
    * `only` {Array|String} - Optional. A action or list of actions to include in the resource routing. Note: `only` takes precendence over `except`
    * `param` {String} - Optional. The parameter name to use, by default it is `id` (accessed by `ctx.params.id`)

## Examples


#### Example 1:

```js
let router = new Router()
router.resources('users', controller.Users)
// GET /users
// GET /users/:id
// POST /users
// PUT /users/:id
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
router.resources('users', controller.Users, { except: ['index', 'show'] })
// POST /users
// PUT /users/:id
// DELETE /users/:id
```

#### Example 5:

```js
let router = new Router()
router.resources('users', controller.Users, { except: 'destroy' })
// GET /users
// GET /users/:id
// POST /users
// PUT /users/:id
```


