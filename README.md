# ![Logo](http://clarkdo.github.io/public/img/hero-logo-blue.svg) Application boilerplate based on Vue.js 2.x, Koa 2.x, Element-UI and Nuxt.js

[![CircleCI](https://circleci.com/gh/clarkdo/hero.svg?style=svg)](https://circleci.com/gh/clarkdo/hero)
[![Windows](https://ci.appveyor.com/api/projects/status/16eua6xnlnwxqomp?svg=true)](https://ci.appveyor.com/project/clarkdo/hero)
[![Vulnerabilities](https://snyk.io/test/github/clarkdo/hero/badge.svg)](https://snyk.io/test/github/clarkdo/hero)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![ESLint](https://img.shields.io/badge/styled_with-eslint-blue.svg?colorB=8080f2)](https://github.com/eslint/eslint)
[![Issues](https://img.shields.io/github/issues/clarkdo/hero.svg)](https://github.com/clarkdo/hero/issues)
[![Stars](https://img.shields.io/github/stars/clarkdo/hero.svg)](https://github.com/clarkdo/hero/stargazers)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/clarkdo/hero/master/LICENSE)

## Installation

``` bash
$ git clone git@github.com:clarkdo/hero.git
$ cd hero
# install dependencies
$ yarn
```

## Usage

### Development

``` bash
# serve with hot reloading at localhost:7777
$ yarn dev
```

Go to [http://localhost:7777](http://localhost:7777)

### Testing

``` bash
# configure ESLint as a tool to keep codes clean
$ yarn lint
# use ava as testing framework, mixed with jsdom
$ yarn test
```

### Production

``` bash
# build for production and launch the server
$ yarn build
$ yarn start
```

### Generate

``` bash
# generate a static project
$ yarn generate
```

### Analyze

``` bash
# build and launch the bundle analyze
$ yarn analyze
```

### Use PM

#### Further more features refer: [PM2](https://github.com/Unitech/pm2)

``` bash
# install pm2 globally
$ yarn global add pm2
# launch development server
$ yarn dev:pm2
# launch production server
$ yarn start:pm2
# Display all processes status
$ pm2 ls
# Show all information about app
$ pm2 show hero
# Display memory and cpu usage of each app
$ pm2 monit
# Display logs
$ pm2 logs
# Stop
$ pm2 stop hero
# Kill and delete
$ pm2 delete hero
```

### Docker Dev

``` bash
# build image
$ docker build -t hero-dev -f Dockerfile.dev ./
$ docker run -d -p 8888:7777 -e HOST=0.0.0.0 hero-dev
```

Go to [http://localhost:8888](http://locdoalhost:8888)

### Docker Production

``` bash
# build bundle
$ export NODE_ENV=''
$ yarn
$ yarn build
# install production dependencies (remove devDependencies)
$ yarn --prod
# build image
$ docker build -t hero-prod -f Dockerfile ./
$ docker run -d -p 8889:7777 -e HOST=0.0.0.0 hero-prod
```

Go to [http://localhost:8889](http://locdoalhost:8889)

## Documentation

Vue.js documentation: [https://vuejs.org/](https://vuejs.org/)

Nuxt.js documentation: [https://nuxtjs.org](https://nuxtjs.org)

Element-UI documentation: [http://element.eleme.io](http://element.eleme.io/#/en-US)

Koa documentation: [https://github.com/koajs/koa](https://github.com/koajs/koa)
