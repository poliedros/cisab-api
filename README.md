# api-gateway

<a></a><img src="https://img.shields.io/github/workflow/status/poliedros/api-gateway/test%20code" alt="Github Actions" /></a>
<a>[![Coverage Status](https://coveralls.io/repos/github/poliedros/api-gateway/badge.svg?branch=main)](https://coveralls.io/github/poliedros/api-gateway?branch=main)</a>

## Description

Api gateway is the facade api for projects

## Auth

To keep a route safe, use the _JwtAuthGuard_

```
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}
```

## Interceptors

### Timeout

Timeout interceptor is global and used to timeout a requisition if it takes more than 10 seconds.

```
app.useGlobalInterceptors(new TimeoutInterceptor());
```

## Health

Health module is used to check if the API itself is up and running and to check other services.

## Users

Module to keep users' data saved. It can be used with whatever database the project requires.

## Architecture

![Solution architecture](/docs/assets/architecture.png 'Solution architecture')

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
