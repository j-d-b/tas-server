# TAS Backend - GraphQL
The `gql/` directory contains the GraphQL resolvers and schema, exported as an Apollo Executable Schema from `schema.js`.

The schema is broken into the files in `schema/`, which are imported into `schema.js`.

These files generally contain a single exported type definition, with two exceptions.

Input types, however, are included within the `schema/query.js` and `schema/mutation.js` files which use them.

Secondly, `TypeDetails` is a union type, so `type-details.js` also contains the sub-types that compose it.

## Database Related Notes
### Appointments
Each appointment in the `appts` database collection contains a `userEmail` field, which is used to fetch corresponding user details from the `users` collection.

Each appointment entry also contains a `typeDetails` field, which contains an object with a variable number of fields depending on the appointment `type` field. See `./schema/type-details` for examples of what this field can contain.

Additionally, the `id` field on the `Appointment` type (see `./schema/appointment.js`) uses the automatically generated `$loki` identifier.

All other fields map directly to the `Appointment` schema fields and resolvers are trivial.

### Users
Unlike appointments, each user in the `users` collection contains the same fields of type `User` as the GraphQL schema (`./schema/user.js`). Thus resolving the user object to the GraphQL return is trivial.

## Resolver structure
`auth.js` holds and exports resolvers/resolver chains which throw apollo errors. Resolvers in this file only check and modify the `context` parameter of the resolver. This includes checking jwts and verifying identity. Checks in `auth.js` do not assume anything in the resolver `arg` parameter.

Each root resolver has an associated `.js` file of the same name (changing camelCase to dash-deliminated). Each file exports (as default) the resolver to perform the root resolver request. No error throwing should occur in these files; *only* checks from `checks.js` (which throw errors) followed by the requested action, usually a database query or insertion.

`checks.js` exports checks for use in resolvers. All checks will throw semantic errors if the check fails, halting further execution of the resolver. Some checks return objects to avoid duplicate database queries. For example, `doesUserExistCheck` returns the user object from the database.
