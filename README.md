# TAS Backend

Truck appointment system for BCTC: backend service

## Usage
Install dependencies
```
yarn
```

An environment variables file must also be added (add `/.env`), containing the following definitions (values are given as examples only):
```
JWT_SECRET=secret-key

```

A signed, non-expired JWT must be included in the HTTP header of the request
```
Authorization : Bearer <JWT>
```

### Development and testing
Setup database with sample data and start the server
```
yarn develop
```

For testing GraphQL queries, use GraphQL Playground, available at `http://localhost:4000/playground`

Valid HTTP header must be included, obtain one by logging in or signing up *(login and signup mutations)*

for example
```
mutation {
  login(email: "jacob@jdbrady.info", password: "dragonspark")
}
```

Then, include the JWT string received from the response in the 'HTTP HEADERS' section in the bottom of the playground in the following form:
```
{ "Authorization": "Bearer <JWT>" }
```

You can now access all endpoints until the token expires.

If you receive a response with the following error
```
{
  "error": "Unexpected token < in JSON at position 0"
}
```
You either have an invalid/expired token, or have not included the HTTP header.

I'm working on making that response more semantic, though since authentication occurs in the middleware layer, this is a server error rather than a GraphQL error.

In development mode, the server is run with `nodemon`, which enables hot reloading.


### Production
**Note:** Production version is not yet functional

Setup the database and relevant collection (users, appointments...) *first time only*
```
yarn setup
```

Start the server
```
yarn start
```

Endpoint available at `http://localhost:4000/graphql`
