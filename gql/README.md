# TAS Backend - GraphQL
The `gql/` directory contains the GraphQL resolvers and schema, exported as an Apollo Executable Schema from `schema.js`.

The schema is broken into the files in `schema/`, which are imported into `schema.js`.

These files generally contain a single exported type definition, with two exceptions.

Input types, however, are included within the `schema/query.js` and `schema/mutation.js` files which use them.

Secondly, `TypeDetails` is a union type, so `type-details.js` also contains the sub-types that compose it.

## Database Related Notes
### Appointments
Each appointment in the `appts` database collection contains a `userEmail` field, which is used to fetch corresponding user details from the `users` collection.

Each appointment also contains a `typeDetails` field, which contains an object with a variable number of fields depending on the appointment `type` field. See `./schema/type-details` for examples of what this field can contain.

Additionally, the `id` field on the `Appointment` type (see `./schema/appointment.js`) uses the automatically generated `$loki` identifier.

All other fields map directly to the `Appointment` schema fields and resolvers are trivial.

### Users
Unlike appointments, each user in the `users` collection contains the same fields of type `User` as the GraphQL schema (`./schema/user.js`). Thus resolving the user object to the GraphQL return is trivial.
