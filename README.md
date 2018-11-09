# TAS Server 🚚
This repository contains the GraphQL API server for the [BCTC](http://www.bctc-lb.com/) Truck Appointment System (TAS) backend.

The TAS end-product is intended to have both web and native mobile interfaces. Following [JAMStack](https://jamstack.org/) principles, the backend exists in a separate environment as a web server exposing a GraphQL API endpoint for use by the web and mobile applications.

The `tas-server` connects to a MariaDB (or MySQL) database specified in the `.env` configuration.

## Getting Started
### Prerequisites
You must have the following installed:
* [Node.js](https://nodejs.org/en/) (^10.7.0)
* [Yarn](https://yarnpkg.com/en/) (^1.7.0)

### Environment Variables
A `.env` environment variables file must also be added to the project root directory. It must contain the following definitions (values are given as examples only):
```
PORT=4000
WEB_APP_URL=https://tas-app.netlify.com
SECRET_KEY=secret-key
DB_CONNECTION_STRING=mysql://iaojsdif.xyz
MG_FROM_EMAIL=test@mailgun.org
MG_API_KEY=my-mailgun-api-key
MG_DOMAIN=my-mailgun-domain.org
PLIVO_AUTH_ID=SAMPLEAUTHID
PLIVO_AUTH_TOKEN=SAMPLEAUTHTOKEN
PLIVO_SRC_NUM=11231231234
```

### Installation
Install dependencies
```
yarn install
```

## Usage
To use the `tas-server`, the database must be prepared (with the necessary tables) and the server started. The GraphQL API can then be queried.

The database can be initialized with scripts in `data/data/setup-scripts/` (used in the yarn scripts below)
* `setup-prod.js` sets up all the tables, dropping any existing data (it will warn you)
* `setup-dev.js` sets up the tables and also adds sample data (also dropping existing data, without warning you)

The entry point file, `src/index.js`, starts the server (`src/server/server.js`).

The server can run in two modes: `development` and `production`.

### Development and testing
Setup the database with sample data (clearing existing data; it will warn you) and start the server:
```
yarn develop
```

In development mode, the server is run with `nodemon`, which restarts the server any time a file is modified.

You can also start the server without adding/clearing sample data using
```
yarn start:dev
```

or just reset the database to only sample data (it will warn you) with
```
yarn setup:dev
```

### Production
Setup the database tables (users, blocks, appts, config) *first time only*
```
yarn setup
```
**Note:** Running `yarn setup` will drop all existing database tables (it will warn you and ask for confirmation), so *only run if looking for a fresh start.*

Start the server (with `NODE_ENV` set to `production`)
```
yarn start
```

## Querying the GraphQL API
Once the server is running, the GraphQL API will be available at `http://localhost:PORT/graphql`, with `PORT` as defined in `.env`.

For testing GraphQL queries, use GraphQL Playground, available at `http://localhost:PORT/playground`.

**Note:** The playground is available in development mode only.

### JSON Web Tokens (JWTs)
Authentication and authorization in the `tas-server` uses [JWT](https://jwt.io/)s in several locations, but primarily as access tokens.

Access token JWTs are signed by the backend with the `SECRET_KEY` from `.env`.

A signed, non-expired JSON Web Token must be included in the HTTP authorization header to access many of the resources.
```
Authorization : Bearer <JWT>
```
Where `<JWT>` is replaced by the JWT obtained from logging in (the `login` mutation).

Verification of the JWT (that it has been signed with the correct `SECRET_KEY`) allows access to all of the queries (`authentication`), though the `userRole` claim in the token is also checked to ensure the query can be performed by that given user (`authorization`).

**Example implementation:** The [TAS Web App](https://github.com/j-d-b/tas-app/) stores the JWT given on login in `window.localStorage` and includes it with every request to the `tas-server` API. *'Logging out'* of the application removes the JWT from storage.

### Public Queries
Certain `queries` and `mutations` can be access without any JWT given:
* `addUser` *- for registration*
* `login` *- obtain JWT*
* `sendResetPassLink` *- if password is forgotten*
* `resetPassword` *- following reset link*

### An Example (with GraphQL Playground)
Log in using a sample user
```
mutation {
  login(input: { email: "jacob@jdbrady.info", password: "dragonspark" })
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
Uses ESLint style-linting configuration defined in [.eslintrc.js](https://github.com/j-d-b/tas-server/blob/master/.eslintrc.js).
```
yarn lint
```

## Deployment
The production TAS will be deployed using [Docker](https://www.docker.com/). `tas-server` is one part of the of the three-piece TAS backend, along with a notification cron and the database.

The full TAS backend with `tas-server` as a submodule is exists as the [`tas-backend`](https://github.com/j-d-b/tas-backend) project. The entire backend is deployed with Docker Compose.

## Docker
The `tas-server` project can be run with [Docker](https://www.docker.com/). Is is also on [Docker Hub](https://hub.docker.com/r/jbrdy/tas-server/).

To start `tas-server`, run:
```
docker build -t tas-server .
docker run -p 4000:4000 tas-server
```

The default `NODE_ENV` (set in the Dockerfile) is `development`.

### Production
Set the environment to `production` with
```
docker run -e NODE_ENV=production -p 4000:4000 tas-server
```

### Database Setup
To set up the database, `docker exec` into the container running `tas-server` and run either `yarn setup` or `yarn setup:dev`.
```
docker exec -it tas-server bash
yarn setup
exit
```

### Persisting Logs
The dockerized `tas-server` logs to the `/tas-server/logs/` directory within the container. I recommend using volumes to persist this data within the docker area.

For example:
```
docker run -v tas-server-logs:/tas-server/logs -p 4000:4000 tas-server
```

Then, log files can be found at `/var/lib/docker/volumes/tas-server-logs/` on the host machine.

### Docker Compose
The Dockerized `tas-server` is exciting when used with [Docker Compose](https://docs.docker.com/compose/) to simultaneously start, setup, and connect to a MariaDB database with a single command.

I've done this, a combined `tas-server`, database, and notification spawning cron process in the [`tas-backend`](https://github.com/j-d-b/tas-backend) project.

## Project Organization
All JavaScript is located in `src/`

`src/index.js` is the entry point to run the application. It will start the server express server and expose the GraphQL endpoint. This is run by `yarn start`.

### src/data/
* Contains Sequelize models and model definitions for interacting with the database.
* Contains database connection configuration.
* `setup-scripts/` contains database table setup code, run by `yarn setup` and `yarn develop`.

### src/logging/
* Logs to `/logs/` directory (will be created if it does not exist).
* `exceptions.log` contains any uncaught exceptions.
* `errors.log` contains all server errors.
* `combined.log` contains all server requests, server error responses, GraphQL queries fired, and errors.
* `verbose.log` contains everything in `combined.log` with the addition of database queries.

### src/messaging/
* Contains all email and SMS sending code and templates (If you're updating the frontend colors/logo, you'll have to change these templates too.)
* Email is sent using [Mailgun](https://www.mailgun.com/)
* SMS is sent using [Plivo](https://www.plivo.com/sms/)

### src/graphql/
* Contains all GraphQL resolvers (helpers, input checking, errors...) and schema. There is a **README** here as well.

### src/rest/
* Contains all code for REST routes. Currently (and potentially forever), the only REST route is `/auth-token`, which gets an auth token using the `refreshToken` cookie.

### src/terminal-connection/
* Contains all code related to fetching data from the container terminal. Specifically:
  * Getting container block location
  * Getting container size (for `IMPORTFULL` appointments)

## Built With
Node 10.7.0, using ECMAScript 2018 features (lot's of `async` (ES2017) and Rest/Spread (ES2018)).

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
The TAS (and thus `tas-server`) was built for [BCTC](http://www.bctc-lb.com/) and is licensed under the [GNU General Public License, Version 3](https://www.gnu.org/licenses/gpl-3.0.en.html).

See `LICENSE.md`(https://github.com/j-d-b/tas-server/blob/master/LICENSE.md) for details.

## Contributing
I don't have an official contribution guide, but welcome pull requests and any form of comments; feel free to get in touch.

## Todo
There are a still few areas that need attention.

### Core
* Assess the need/config for CORS
* Re-assess which appt fields can be updated after booking

### Cleanup
* Write tests

### Enhancement
* Gate capacity and planned activities templates

### Production
* Connect to BCTC container details server
* Switch from Mailgun to BCTC's SMTP server

---

<p align="center">Copyright (C) 2018 <a href="https://kcus.org/home">KCUS, Inc.</a></p>
