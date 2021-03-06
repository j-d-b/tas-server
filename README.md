# TAS Server 🚚
This repository contains the GraphQL API server originally built for the [BCTC](http://www.bctc-lb.com/) Truck Appointment System (TAS).

The TAS end-product is intended to have both web and native mobile interfaces. The backend web server exists in a separate environment (potentially physically) and exposes a GraphQL API endpoint for use by the web and mobile applications.

The `tas-server` connects to a MariaDB (or MySQL) database specified in the `.env` configuration.

## Getting Started

### Prerequisites
You must have the following installed:

* [Node.js](https://nodejs.org/en/) (^10.7.0)
* [Yarn](https://yarnpkg.com/en/) (^1.7.0)

### Environment Variables
A `.env` environment variables file must also be added to the project root directory. It must contain the following definitions:

* `PORT`: port to open for TAS API server
* `WEB_APP_URL`: full URL of TAS web app
* `SECRET_KEY`: key used to sign API access tokens
* `DB_CONNECTION_STRING`: URL connection string for the MariaDB database (e.g. mysql://user@bctc-tas.com/tas)
* `TIMEZONE`: IANA time zone string (e.g. `Asia/Beirut`) to set time zone (location of container server)
* `MG_FROM_EMAIL`: Mailgun sender email address (email sending)
* `MG_API_KEY`: Mailgun API key (email sending)
* `MG_DOMAIN`: Mailgun domain (email sending)
* `TWILIO_ACCT_SID`: Twilio Account Sid (SMS Sending)
* `TWILIO_AUTH_TOKEN`: Twilio Auth Token (SMS Sending)
* `TWILIO_SRC_NUM`: Twilio sender mobile number (SMS sending)
* `DB_SETUP_DEFAULT_ALLOWED_APPTS_PER_HOUR`: Initial `config` table value for `defaultAllowedApptsPerHour`
* `DB_SETUP_MAX_TFU_PER_APPT`: Initial `config` table value for `maxTFUPerAppt`
* `DB_SETUP_ARRIVAL_WINDOW_LENGTH`: Initial `config` table value for `arrivalWindowLength` *must be `5`, `10`, `15`, `30`, or `60`*
* `DB_SETUP_APPTS_QUERY_MAX_COUNT`: Initial `config` table value for `apptsQueryMaxCount`
* `ROOT_USER_PW`: Password for the initial root user
* `REMIND_HOUR`: Hour of the day (in the given TIMEZONE) to send appointment reminders

### Installation
Install dependencies

```shell
yarn install
```

## Usage
To use the `tas-server`, the database must be prepared (with the necessary tables) and the server started. The GraphQL API can then be queried.

The database can be initialized with scripts in `lib/data/setup-scripts/` (used in the yarn scripts below)

* `setup-prod.js` sets up all the tables, dropping any existing data (it will warn you)
* `setup-dev.js` sets up the tables and also adds sample data (also dropping existing data, without warning you)

The entry point file, `lib/index.js`, starts the server (`lib/server/server.js`).

The server can run in two modes: `development` and `production`.

### Development and testing
Setup the database with sample data (clearing existing data; it will warn you) and start the server:

```shell
yarn develop
```

In development mode, the server is run with `nodemon`, which restarts the server any time a file is modified.

You can also start the server without adding/clearing sample data using

```shell
yarn start:dev
```

or just reset the database to only sample data (it will warn you) with

```shell
yarn setup:dev
```

### Production

#### Setup
Setup the database tables (`users`, `restrictions`, `appts`, `actions`, `config`) *first time only*

```shell
yarn setup
```

**Note:** Running `yarn setup` will drop all existing database tables (it will warn you and ask for confirmation), so *only run if looking for a fresh start.*

This script will create a single entry in the `config` table using the `DB_SETUP` prefixed environemnt variables from `.env`. The application can not run unless there is an entry in the `config` table with values for each field.

The script will also create a single admin user named `root` with the password defined in the `ROOT_USER_PW` environment variable.

This user cannot be queried, deleted, or modified using the API. It is intended to be used to confirm and promote to admin the desired system administrator after he/she has registered. After this, `root` should not be used.

#### Starting the server
Start the server (with `NODE_ENV` set to `production`)

```shell
yarn start
```

## Dates and Time Zones

The `tas-server` stores all *dates in UTC* and all *time slot and hour values in the given `TIMEZONE`*.

When received as input, time slot object { date, hour }, day of week, arrival window, and hour values are assumed to be in the given `TIMEZONE`. This includes data received from queries/mutation.

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

### Unprotected Queries
Certain `queries` and `mutations` can be access without any JWT given:

* `addUser` *- for registration*
* `login` *- obtain JWT*
* `sendResetPassLink` *- if password is forgotten*
* `resetPassword` *- following reset link*

### An Example (with GraphQL Playground)
Log in using a sample user

```javascript
mutation {
  login(input: { email: "jacob@jdbrady.info", password: "dragonspark" })
}
```

This mutation will return a string, the JWT.

Include the JWT string received from the response in the **HTTP HEADERS** section (in the bottom of the playground) in the following form:

```json
{ "Authorization": "Bearer eyJhbGciOiJIUzI1NiI..." } // string truncated for brevity
```

You can now access all endpoints until the token expires. Let's try out a simple `me` query.

```javascript
{
  me {
    name
  }
}
```

This should return

```json
{
  "data": {
    "me": {
      "name": "Jacob Brady"
    }
  }
}
```

Great; you're on your way.

## REST API and Refresh Tokens
The `tas-server` exposes one REST endpoint, `/auth-token`.

This endpoint will respond with a signed JWT (auth/access token) if the request includes a valid `refreshToken` cookie. This cookie is set by the `login` GraphQL mutation. The refresh token is encrypted and stored on the user.

## Reminders (`src/reminders`)

This version of the TAS server includes a service which sends reminder emails and SMS to users with appointments for the next day. Reminders are sent every day at the given `REMIND_HOUR` (environment variable).

Previously, the reminder system was a separate service which made the `sendApptReminders` mutation. This is cleaner if deploying the TAS with Docker; see the [separate-reminders branch](https://github.com/j-d-b/tas-server/tree/separate-reminders) for this implementation.

## Testing
Run the test suite with

```shell
yarn test
```

Tests were unforunately a quick-and-dirty addition to this project and thus are largely tests of each graphql resolver which make actual calls to the database. Thus data in the database give in `.env` will be overwritten when running tests so *please ensure you have a test environment set up and do not run this on the live system.* Additionally, you must call the following code in each test suite.

```javascript
require('dotenv').config();
require('moment-timezone').tz.setDefault(process.env.TIMEZONE);
```

### Linting
Uses [ESLint](https://eslint.org/); configuration defined in [.eslintrc.js](https://github.com/j-d-b/tas-server/blob/master/.eslintrc.js).

```shell
yarn lint
```

## Deployment
The production TAS will be deployed using [Docker](https://www.docker.com/). `tas-server` is one part of the two-piece TAS backend, the other part is the database.

The full TAS backend with `tas-server` as a submodule is exists as the [`tas-backend`](https://github.com/j-d-b/tas-backend) project. The full backend is deployed with Docker Compose.

## Docker
The `tas-server` project can be run with [Docker](https://www.docker.com/). Is is also on [Docker Hub](https://hub.docker.com/r/jbrdy/tas-server/).

To start `tas-server`, run:

```shell
docker build -t tas-server .
docker run -p 4000:4000 tas-server
```

The default `NODE_ENV` (set in the Dockerfile) is `development`.

### Production
Set the environment to `production` with

```shell
docker run -e NODE_ENV=production -p 4000:4000 tas-server
```

### Database Setup
To set up the database, `docker exec` into the container running `tas-server` and run either `yarn setup` or `yarn setup:dev`.

```shell
docker exec -it tas-server bash
yarn setup
exit
```

### Persisting Logs
The dockerized `tas-server` logs to the `/tas-server/logs/` directory within the container. I recommend using named volumes to persist this data to the docker area.

For example:

```shell
docker run -v tas-server-logs:/tas-server/logs -p 4000:4000 tas-server
```

Then, log files can be found at `/var/lib/docker/volumes/tas-server-logs/` on the host machine.

### Docker Compose
The Dockerized `tas-server` is exciting when used with [Docker Compose](https://docs.docker.com/compose/) to simultaneously start, setup, and connect to a MariaDB database with a single command.

I've done this in the [`tas-backend`](https://github.com/j-d-b/tas-backend) project.

## Project Organization
All JavaScript is located in `lib/`

`lib/index.js` is the entry point to run the application. It will start the server express server and expose the GraphQL endpoint. This is run by `yarn start`.

### lib/data/

* Contains Sequelize models and model definitions for interacting with the database.
* Contains database connection configuration.
* `setup-scripts/` contains database table setup code, run by `yarn setup` and `yarn develop`.

### lib/logging/

* Logs to `/logs/` directory (will be created if it does not exist).
* `exceptions.log` contains any uncaught exceptions.
* `errors.log` contains all server errors.
* `combined.log` contains all server requests, server error responses, GraphQL queries fired, and errors.
* `verbose.log` contains everything in `combined.log` with the addition of database queries.

### lib/messaging/

* Contains all email and SMS sending code and templates (If you're updating the frontend colors or logo, you'll have to change these templates too.)
* Email is sent using [Mailgun](https://www.mailgun.com/)
* SMS is sent using [Twilio](https://www.twilio.com/sms/)

### lib/graphql/

* Contains all GraphQL resolvers (helpers, input checking, errors...) and schema. There is a [**README**](./lib/graphql/README.md) here as well.

### lib/rest/

* Contains all code for REST routes. Currently (and potentially forever), the only REST route is `/auth-token`, which gets an auth token using the `refreshToken` cookie.

### lib/terminal-connection/

* Contains all code related to fetching data from the container terminal. Specifically:
  * Checking validity of container details.
  * Getting container size (for `IMPORT_FULL` appointments)

## Built With
Node 10.7.0, using ECMAScript 2018 features.

This project relies on the following technologies, most included as `npm` packages.

* [Express](https://expressjs.com/) - Web server exposing the GraphQL API endpoint
* [Mailgun](https://www.mailgun.com/) - Email sending service
* [Twilio](https://www.twilio.com/sms/) - SMS sending service
* [Apollo Server](https://www.apollographql.com/docs/apollo-server/) - Express middleware to facilitate GraphQL interactions
* [Sequelize](http://docs.sequelizejs.com/) - Abstracting database interactions
* [ESLint](https://eslint.org/) - JavaScript linting
* [Nodemailer](https://nodemailer.com/about/) - Email sending
* [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - Signing and verifying JWTs
* [Apollo Errors](https://github.com/thebigredgeek/apollo-errors) and [Apollo Resolvers](https://github.com/thebigredgeek/apollo-resolvers) - Error management/formatting and easy resolver authentication by chaining
* [node-cron](https://github.com/node-cron/node-cron) - Daily appointment reminder sending

## License
The TAS (and thus `tas-server`) was built for [BCTC](http://www.bctc-lb.com/) and is licensed under the [GNU General Public License, Version 3](https://www.gnu.org/licenses/gpl-3.0.en.html).

See [`LICENSE.md`](https://github.com/j-d-b/tas-server/blob/master/LICENSE.md) for details.

## Contributing
I don't have an official contribution guide, but welcome pull requests and any form of comments (submit an issue!); if you're interested in contributing, please get in touch.

## Todo
There are a still few areas that need attention.

- [ ] Configure CORS
- [x] Switch from Mailgun to client's SMTP server (completed in [`bctc-prod branch`](https://github.com/j-d-b/tas-server/tree/bctc-prod))
- [x] Switch to MSSQL (per client request) (completed in [`bctc-prod branch`](https://github.com/j-d-b/tas-server/tree/bctc-prod))

---

Copyright (C) 2020 [KCUS, Inc.](https://kcus.org/home)
