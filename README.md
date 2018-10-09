# TAS Server
This repository contains the GraphQL API server of the BCTC Truck Appointment System (TAS) backend.

The TAS end-product is intended to have both web and native mobile interfaces. Following JAMStack principles, the backend exists in a separate environment as a web server exposing a GraphQL API endpoint for use by the web and mobile applications.

The `tas-server` connects to a MariaDB (or MySQL) database specified in the `.env` configuration.

## Getting Started
### Prerequisites
You must have the following installed:
* [Node.js](https://nodejs.org/en/)
* [yarn](https://yarnpkg.com/en/) package manager

### Environment Variables
A `.env` environment variables file must also be added to the project root directory. It must contain the following definitions (values are given as examples only):
```
PORT=4000
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

### Installation
Install dependencies
```
yarn install
```

## Usage
To use the `tas-server`, the database must be prepared (with the necessary tables) and the server started. The GraphQL API can then be queried.

The database can be initialized with scripts in `data/data/setup-scripts/`
* `setup-prod.js` sets up all the tables, dropping any existing data (it will warn you)
* `setup-dev.js` sets up the tables and also adds sample data (also dropping existing data, without warning you)

The entry point file, `src/index.js`, starts the server (`src/server/server.js`).

The server can run in two modes: `development` and `production`.

### For development and testing
Setup the database with sample data and start the server:
```
yarn develop
```

In development mode, the server is run with `nodemon`, which restarts the server any time a file is modified.

### Production
Setup the database tables (users, blocks, appts, config) *first time only*
```
yarn setup
```
**Note:** Running `yarn setup` will drop all existing database tables (it will warn you), so *only run if looking for a fresh start.*

Start the server (with `NODE_ENV` set to `production`)
```
yarn start
```

## Querying the GraphQL API
GraphQL API endpoint will be available at `http://localhost:4000/graphql`.

For testing GraphQL queries, use GraphQL Playground, available at `http://localhost:4000/playground`. The playground is available in development mode only.

### JSON Web Tokens (JWTs)
Authentication and authorization in the **TAS Backend** uses JWTs.

The JWT is signed by the backend with the `PRIMARY_SECRET` from `.env`.

A signed, non-expired JSON Web Token must be included in the HTTP authorization header to access many of the resources.
```
Authorization : Bearer <JWT>
```
Where `<JWT>` is replaced by the JWT obtained from logging in (the `login` mutation).

Verification of the JWT (that it has been signed with the correct `PRIMARY_SECRET`) allows access to all of the queries (`authentication`), though the `userRole` field in the token is also checked to ensure the query can be performed by that given user (`authorization`).

**Example implementation:** The **TAS Web Application** stores the JWT given on login in `window.localStorage` and includes it with every request to the `tas-server` API. *'Logging out'* of the application removes the JWT from storage.

### Public Queries
Certain `queries` and `mutations` can be access without any JWT given:
* `addUser` *- for registration*
* `login` *- obtain JWT*
* `sendResetPassLink` *- if password is forgotten*
* `resetPassword` *- from reset link*

### An Example (with GraphQL Playground)
Log in using a sample user
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

## Testing
### Linting
Uses ESLint style-linting configuration defined in .eslintrc.js
```
yarn lint
```

## Deployment
I've deployed an example `tas-server` using Heroku with the database as an add-on, available [here](TODO)**TODO**

The production TAS will be deployed using [Docker](https://www.docker.com/). `tas-server` is one piece of the of the three-part TAS backend, along with a notification cron and the database.

The full TAS backend with `tas-server` as a submodule is defined in the [`tas-backend`](TODO)**TODO** project. The entire backend is deployed with Docker Compose.

## Docker
The `tas-server` project can be run with [Docker](https://www.docker.com/).

Set the environment to `production` with `docker run -e NODE_ENV=production`. The default value (set in the Dockerfile) is `development`.

The Dockerized version does not have access to the database setup scripts in `src/data/setup`.

The Dockerized `tas-server` is more beneficial when used with [Docker Compose](https://docs.docker.com/compose/) to simultaneously start, setup, and connect to a MariaDB database in a single command.

I've done this, a combined `tas-server`, database, and notification spawning cron process in the [`tas-backend`](https://bitbucket.org/j-d-b/tas-backend/) project.

## Project Organization
All JavaScript is located in `src/`

`src/index.js` is the entry point to run the application/start the server. This is run by `yarn start`.

### `src/data/`
* Contains Sequelize models and model definitions for interacting with the database.
* Contains database connection configuration.
* `setup-scripts/` contains database table setup code, run by `yarn setup` and `yarn develop`.

### `src/logging`
TODO

### `src/messaging`
* Contains all email and SMS sending code and templates (If you're updating the frontend colors/logo, you'll have to change these templates too.)
* Email is sent with [Mailgun](https://www.mailgun.com/)
* SMS is sent using [Plivo](https://www.plivo.com/sms/)

### `src/server/`
* Contains all code relevant to the express server, including all GraphQL schema, resolvers, and auth.
* `gql/` contains all GraphQL resolvers (helpers, input checking, errors...) and schema. There is a **README** here as well.

## Built With
This project relies on the following technologies, most included as `npm` packages.
* [Express](https://expressjs.com/) - Web server exposing the GraphQL API endpoint
* [Mailgun](https://www.mailgun.com/) - Email sending service
* [Plivo](https://www.plivo.com/sms/) - SMS sending service
* [Apollo Server](https://www.apollographql.com/docs/apollo-server/) - Express middleware to facilitate GraphQL interactions
* [Sequelize](http://docs.sequelizejs.com/) - Abstracting database interactions
* [ESLint](https://eslint.org/) - JavaScript linting
* [Nodemailer](https://nodemailer.com/about/) - Email sending
* [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - Signing and verifying JWTs
* [Apollo Errors](https://github.com/thebigredgeek/apollo-errors) and [Apollo Resolvers](https://github.com/thebigredgeek/apollo-resolvers) - Error management/formatting and easy resolver authentication by chaining

## License
`tas-server` was built for BCTC and is licensed under the [GNU General Public License, Version 3](https://www.gnu.org/licenses/gpl-3.0.en.html).

See `LICENSE.md` for details.

## Contributing
I don't have an official contribution guideline, but welcome pull requests and any form of comments; feel free to get in touch with me.

## Todo
There are a still few areas which need attention.

* Refresh tokens or some sense of a session, rather than a hard-expiry access token
* Implement logging (with winston)
* Write at least *some* tests
* Solidify what appt details can be updated (on `updateAppt` mutation)
* Implement SMS sending
* Implement Gate capacity and planned activities templates
* Database snapshots/backup
* Standardize mutation inputs (single `input` object)
* Update `src/server/gql/README.md`
* Consider DataLoader
