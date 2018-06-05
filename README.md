# TAS Backend

Truck appointment system for BCTC: backend service

Install dependencies
```
yarn
```

Setup database (for fresh installations)
```
yarn setup
```

Start the server using existing database
```
yarn start
```

The server looks for a `tas.json` database file in the root directory, and will create it if it doesn't exist. However, for new installations, the relevant collections must be initialized by running `yarn setup`.

For testing GraphQL queries, use GraphQL Playground, available at `http://localhost:4000/playground`
