# Cisab-api

<a></a><img src="https://img.shields.io/github/actions/workflow/status/poliedros/cisab-api/docker-image.yml?branch=main" alt="Github Actions" /></a>
<a>[![Coverage Status](https://coveralls.io/repos/github/poliedros/cisab-api/badge.svg?branch=main)](https://coveralls.io/github/poliedros/cisab-api?branch=main)</a>

# Description

Cisab API is the main gateway to the outside. All requests will be handled by this project and then eventually distributed inside the system.

There is workers and consumers.

Workers are cronjobs. Consumers consume events dispatched by cisab-api project.

# Modules

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

Users handlers.

# Architecture

![Solution architecture](/docs/assets/architecture.png 'Solution architecture')

# Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

# Swagger

Swagger is installed in this project. Access it through:

http://localhost:3000/swagger
