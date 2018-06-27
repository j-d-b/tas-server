# TAS Backend

Truck appointment system for BCTC: backend service

## Usage
Install dependencies
```
yarn
```

An environment variables file (called `.env`) must also be added to the project root, containing the following definitions (values are given as examples only):
```
JWT_SECRET=secret-key

```

### Development and testing
Setup database with sample data and start the server:
```
yarn develop
```

Test data is added manually in `setup-scripts/setup-dev.js`. Check it out for a list of possible users.

In development mode, the server is run with `nodemon`, which restarts the server any time a file is modified.

For testing GraphQL queries, use GraphQL Playground, available at `http://localhost:4000/playground`. The playground is available in development mode only.

A valid HTTP header must be included to access much of the data, obtain one by logging in or signing up *(login and signup mutations)*

For example (using a test user)
```
mutation {
  login(email: "jacob@jdbrady.info", password: "dragonspark")
}
```

This mutation will return a string, the JWT.

Include the JWT string received from the response in the 'HTTP HEADERS' section in the bottom of the playground in the following form:
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

### Production
**Note:** Production version is not yet functional

Setup the database and relevant collection (users, appointments...) *first time only*
```
yarn setup
```
**Note:** Running `yarn setup` will delete any data in the database `db.json` (it will warn you), so *only run if looking for a fresh start.*

Start the server
```
yarn start
```

Endpoint will be available at `http://localhost:4000/graphql`

A signed, non-expired JSON Web Token must be included in the HTTP header of the request
```
Authorization : Bearer <JWT>
```
Where `<JWT>` is replaced by the JWT obtained from logging in (the `login` mutation).


## JSON Web Tokens
Authentication and authorization in the **TAS Backend** uses JWTs.

The JWT is signed by the backend with the `JWT_SECRET` from `.env`.

The payload of the JWT contains the following information:
```
{
  "exp": 1528469407,                  // Expiration time
  "userEmail": "jacob@jdbrady.info",
  "userRole": "ADMIN",
  "iat": 1528383007                   // Token creation time
}
```

Even if the jwt

### Usage
The JWT must be included in the HTTP authorization header to access much of the TAS queries.

Verification of the JWT (that it has been encoded with the correct `JWT_SECRET`) allows access to all of the queries (`authentication`), though the `userRole` field in the token is also checked to ensure the query can be performed by that given user (`authorization`).

**Example implementation:** The **TAS Web Application** stores the JWT given on login in `window.localStorage` and includes it with every request to the backend API. 'Logging out' of the application removes the JWT from storage.


### Unprotected routes
Certain `queries` and `mutations` can be access without any JWT given:
* `addUser` *<- for registration*
* `login` *<- obtain JWT*
* `sendResetPassLink` *<- if password is forgotten*
* `resetPassword` *<- from reset link*
