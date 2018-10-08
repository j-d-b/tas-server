# TAS Server
This repository contains the GraphQL API server of the BCTC Truck Appointment System (TAS) backend.

The TAS has web and native mobile interfaces, and thus the backend is implemented as an API in a separate environment as a GraphQL server for use by the web and mobile applications.

The entry point file, `src/index.js`, starts the server (`src/server/server.js`).

The backend connects to a MariaDB database server specified in the `.env` configuration.

## Standard Usage
Install dependencies
```
yarn install
```

An environment variables file (called `.env`) must also be added to the project root directory. It must contain the following definitions (values are given as examples only):
```
SERVER_PORT=4000
PRIMARY_SECRET=secret-key
VERIFY_EMAIL_SECRET=different-secret-key
MG_FROM_EMAIL=test@mailgun.org
MG_API_KEY=my-mailgun-api-key
MG_DOMAIN=my-mailgun-domain.org
MYSQL_HOST=127.0.0.1
MYSQL_USER=root
MYSQL_PASSWORD=''
MYSQL_DATABASE=tas
```

The backend is an [Express](https://expressjs.com/) web server which provides a `/graphql` endpoint using [Apollo Server](https://www.apollographql.com/docs/apollo-server/). It uses [Sequelize](http://docs.sequelizejs.com/) to connect to, setup, and model a MariaDB database.

To use the backend, the database and tables must be setup and the server started.

The server can run in two modes: `development` and `production`.

**Environment variables are using in the following files:**
TODO

### For development and testing
Setup the database with sample data and start the server:
```
yarn develop
```

Test data is added to the database manually in `src/data/setup-scripts/setup-dev.js`. Check it out for a list of possible users.

In development mode, the server is run with `nodemon`, which restarts the server any time a file is modified.

For testing GraphQL queries, use GraphQL Playground, available at `http://localhost:4000/playground`. The playground is available in development mode only.

A valid HTTP header must be included to access much of the data, obtain one by logging in or signing up *(login and signup mutations)*

A MariaDB server must be running and able to be connected to using the details specified in `.env`

#### Usage Example (with GraphQL Playground)
Login using a test user
```
mutation {
  login(email: "jacob@jdbrady.info", password: "dragonspark")
}
```

This mutation will return a string, the JWT.

Include the JWT string received from the response in the **HTTP HEADERS** section (in the bottom of the playground) in the following form:
```
{ "Authorization": "Bearer eyJhbGciOiJIUzI1NiI..." } // string truncated for brevity
```

You can now access all endpoints until the token expires. Let's try out a simple `me` query.
```
{
  me {
    name
  }
}
```

This should return
```
{
  "data": {
    "me": {
      "name": "Jacob Brady"
    }
  }
}
```

Great; you're on your way.

#### Linting
Uses ESLint linting configuration in .eslintrc.js
```
yarn lint
```

### For production
**Note: Production version is not yet actually production ready!**

Setup the database tables (users, blocks, appts, config) *first time only*
```
yarn setup
```
**Note:** Running `yarn setup` will drop all existing database tables (it will warn you), so *only run if looking for a fresh start.*

Start the server
```
yarn start
```

GraphQL API endpoint will be available at `http://localhost:4000/graphql`.

A signed, non-expired JSON Web Token must be included in the HTTP authorization header to access many of the resources.
```
Authorization : Bearer <JWT>
```
Where `<JWT>` is replaced by the JWT obtained from logging in (the `login` mutation).

### Testing
You can test that everything is working correctly using the online GraphQL Playground, [graphqlbin](https://www.graphqlbin.com/v2/new).

Connect to `http://localhost:4000/graphql` and execute any valid query, for example:
```
{
  allBlocks {
    currAllowedApptsPerHour
  }
}
```

Since you're not logged in, you should get an error.
```
{
  ...
  "errors": [
    {
      "message": "You must be authenticated to perform this action",
      ...
    }
  ]
}
```

## JSON Web Tokens
Authentication and authorization in the **TAS Backend** uses JWTs.

The JWT is signed by the backend with the `PRIMARY_SECRET` from `.env`.

The payload of the JWT contains the following information:
```
{
  "exp": 1528469407, // expiration time
  "userEmail": "jacob@jdbrady.info",
  "userRole": "ADMIN",
  "iat": 1528383007 // time created               
}
```

### Usage
The JWT must be included in the HTTP authorization header to access much of the TAS queries.

Verification of the JWT (that it has been encoded with the correct `PRIMARY_SECRET`) allows access to all of the queries (`authentication`), though the `userRole` field in the token is also checked to ensure the query can be performed by that given user (`authorization`).

**Example implementation:** The **TAS Web Application** stores the JWT given on login in `window.localStorage` and includes it with every request to the backend API. *'Logging out'* of the application removes the JWT from storage.

### Unprotected routes
Certain `queries` and `mutations` can be access without any JWT given:
* `addUser` *<- for registration*
* `login` *<- obtain JWT*
* `sendResetPassLink` *<- if password is forgotten*
* `resetPassword` *<- from reset link*

## Project Organization
All project code is in `src/`

`src/index.js` is the entry point to run the application/start the server. This is run by `yarn start`.

### `src/data/`
* Contains Sequelize models and model definitions for interacting with the database.
* Contains database connection configuration.
* `setup-scripts/` contains database table setup code, run by `yarn setup` and `yarn develop`.

### `src/logging` TODO

### `src/messaging`
* Contains all email and SMS sending code and templates.
* Email is sent with **Mailgun**, using configuration from `.env`
* If you're updating the frontend colors/logo, you'll have to change these templates too.

### `src/server/`
* Contains all code relevant to the express server, including all graphql schema, resolvers, and auth.
* `gql/` contains all GraphQL resolvers (helpers, input checking, errors...) and schema. There is a **README** here as well.

## Docker
The `tas-server` project can be run with [Docker](https://www.docker.com/).

Set the environment to `production` with `docker run -e NODE_ENV=production`. The default value (set in the Dockerfile) is `development`.

Note that the Dockerized version does not have access to the database setup scripts in `src/data/setup`.

The Dockerized `tas-server` becomes more beneficial when used with [Docker Compose](https://docs.docker.com/compose/) to simultaneously start, setup, and connect to a MariaDB database.

I've done this, a combined `tas-server`, database, and notification spawning cron process in the larger [`tas-backend`](https://bitbucket.org/j-d-b/tas-backend/) project.

## Todo
This project is pretty close to production-capable (aside from any written tests 😮). From the perspective of the frontend, everything is there. However, there are a few areas which need attention.
**TODO**
* Refresh tokens or some sense of a session, rather than a hard-expiry access token
* Implement logging (with winston)
* Solidify what appt details can be updated (on `updateAppt` mutation)
* Implement SMS sending
* Implement Gate capacity and planned activities templates
* Database snapshots/backup
* Standardize mutation inputs (single `input` object)
* Update `src/server/gql/README.md`
* Consider DataLoader
