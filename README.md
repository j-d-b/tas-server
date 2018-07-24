# TAS Backend

This repository contains the API backend service for the BCTC Truck Appointment System (TAS).

The TAS has web and native mobile interfaces, and thus the backend is implemented as an API in a separate environment as a GraphQL server for use by the web and mobile applications.

The entry point file, `index.js`, starts the server (`server/server.js`).

The backend connects to a MariaDB database server specified in the `.env` configuration

## Usage
Install dependencies
```
yarn
```

An environment variables file (called `.env`) must also be added to the project root directory. It must contain the following definitions (values are given as examples only):
```
PRIMARY_SECRET=secret-key
VERIFY_EMAIL_SECRET=different-secret-key
MG_FROM_EMAIL=test@mailgun.org
MG_API_KEY=my-mailgun-api-key
MG_DOMAIN=my-mailgun-domain.org
MARIADB_HOST=127.0.0.1
MARIADB_USER=root
MARIADB_PASSWORD=''
MARIADB_DATABASE=tas
```

The backend is an [Express](https://expressjs.com/) web server which provides a `/graphql` endpoint using [Apollo Server](https://www.apollographql.com/docs/apollo-server/). It uses [Sequelize](http://docs.sequelizejs.com/) to connect to, setup, and model a MariaDB database.

To use the backend, the database tables must be setup and the server started.

The server can run in two modes: `development` and `production`.

### For development and testing
Setup the database with sample data and start the server:
```
yarn develop
```

Test data is added to the database manually in `setup-scripts/setup-dev.js`. Check it out for a list of possible users.

In development mode, the server is run with `nodemon`, which restarts the server any time a file is modified.

For testing GraphQL queries, use GraphQL Playground, available at `http://localhost:4000/playground`. The playground is available in development mode only.

A valid HTTP header must be included to access much of the data, obtain one by logging in or signing up *(login and signup mutations)*

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

### For production
**Note: Production version is not yet actually production ready!**

Setup the database and relevant collections (users, appointments...) *first time only*
```
yarn setup
```
**Note:** Running `yarn setup` will delete any data in the database `db.json` (it will warn you), so *only run if looking for a fresh start.*

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

### Linting
Uses ESLint linting configuration in .eslintrc.js
```
yarn lint
```

## JSON Web Tokens
Authentication and authorization in the **TAS Backend** uses JWTs.

The JWT is signed by the backend with the `PRIMARY_SECRET` from `.env`.

The payload of the JWT contains the following information:
```
{
  "exp": 1528469407,                  // Expiration time
  "userEmail": "jacob@jdbrady.info",
  "userRole": "ADMIN",
  "iat": 1528383007                   // Token creation time
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
