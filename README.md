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
```
{ "Authorization": "Bearer <JWT>" }
```

Endpoint available at `http://localhost:4000/graphql`

In development mode, the server is run with `nodemon`, which enables hot reloading.


### Production
Setup the database and relevant collection (users, appointments...) *first time only*
```
yarn setup
```

Start the server
```
yarn start
```

Endpoint available at `http://localhost:4000/graphql`
