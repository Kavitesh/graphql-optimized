# GraphQL Server with Role-Based Access Control and N+1 query resolver.

This project is a modular GraphQL server built with Express and GraphQL. It features role-based access control, filtering GraphQL queries based on the user's role and a N+1 resolver to optimize queries.

## Features

- Role-based access control for GraphQL queries
- N+1 resolver to optimize queries

## Project Structure

```plaintext
/graphql-optimized
│
├── /authorizationEngine       # Authorization Engine
│   ├── accessRules.js            # Access control rules
│   ├── accessRulesValidator.js   # Logic to apply access rules and optimize GraphQL queries
│   └── authorizationEngine.js    # Authorization Engine
├── /db                        # Database-related files
│   ├── populateDb.js             # Helper code to generate dummy db
│   └── products.db               # Dummy database, auto generate by command 'npm run populateDb'
├── /resolvers                 # GraphQL Resolvers 
│   ├── normalResolvers.js        # Normal resolver
│   ├── nPlus1Resolvers.js        # GraphQL N+1 resolver
│   ├── optimizeResolvers.js      # Final Resolver with N+1 and Authorization
│   └── resolversStub.js          # Dummy resolver with static data
├── executableSchema.js        # GraphQL executable schema (schema + resolvers) for deployment
├── internalGraphqlEngine.js   # Main GraphQL server
├── package.json               # Project package file
├── schema.js                  # GraphQL schema definition
└── server.js                  # Main server entry point
```

## Setup Instructions
 - npm install : to download dependencies
 - npm start : to run server with our optimized resolver
 - npm start normal : to run server with normal graphql
 - server url : http://localhost:4000/graphql
 ```bash
 npm install
 npm start # or use 'npm start normal' to avoid using optimized resolver
 curl -X POST http://localhost:4000/graphql -H "Authorization: USER" -H "Content-Type: application/json" -d '{"query": "query { getProducts { id name version vendors { id name quantity amount addresses { id name location } } } }"}'
```
