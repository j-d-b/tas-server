# TAS Server - GraphQL
This directory contains the GraphQL resolvers and schema, exported as an Apollo Executable Schema from `schema.js`.

## Schema
The schema is broken into the files in `schema/`, which are imported into `schema.js`.

Every mutation requires a single input object with the same name (+ 'Input') as the mutation. These input types are located in `schema/mutation-input-types` to keep the main directory cleaner. `schema/mutation-input-types/index.js` requires all the input types and exports them as an array.

Query input types are still included in `schema/query.js`.

The files in `schema/` generally contain a single type definition, with one exception:
* `TypeDetails` is a union type, so `type-details.js` also contains its composing types.
* `schema/query.js` defines input types used only in queries.

All files in `schema/` have a single export.

`schema.js` exports an executable schema for use by the [Apollo Server express](https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-express) middleware.

## Resolvers
All of the core TAS functionality is contained in the `resolvers/` directory.

`resolvers/auth.js` holds and exports resolvers/resolver chains which throw [Apollo Errors](https://github.com/thebigredgeek/apollo-errors). Resolvers in this file only check and modify the `context` parameter of the resolver. This includes checking JWTs for validity and limiting access by user role. Checks in `resolvers/auth.js` do not assume anything in the resolver `arg` parameter.

Each root resolver has an associated `.js` file of the same name (though dash-delimited rather than camelCase), in `resolvers/mutation`, `resolvers/query`, and `resolvers/scalar`. Each file exports (as default) the resolver to perform the root resolver request. No error throwing should occur in these files (sending mail with `try/catch` is the only exception); *only* checks from `resolvers/checks.js` (which throw errors) followed by the requested action, usually a database query or insertion.

`resolvers/checks.js` exports checks for use in resolvers. All checks will throw semantic errors if the check fails, halting further execution of the resolver. Some checks return objects to avoid duplicate database queries. For example, `doesUserExistCheck` returns the user object from the database.

`resolvers/errors.js` exports all the possible GraphQL errors that can be thrown by `tas-server`.

`resolvers/helpers.js` exports helping functions used by many of the resolvers.

`resolvers/index.js` imports all the individual root resolvers from `resolvers/`, defines resolvers on each type, and exports the full resolvers object used to create the executable schema.

### Sending mail
The following mutations send transactional emails to a given user:
* addUser
* confirmUser
* sendResetPassLink
* sendVerifyEmailLink
* sendApptReminders
