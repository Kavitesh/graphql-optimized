# GraphQL Server with Role-Based Access Control and N+1 query resolver.

This project is a modular GraphQL server built with Express and GraphQL. It features role-based access control, filtering GraphQL queries based on the user's role and a N+1 resolver to optimize queries.

## Features

- Role-based access control for GraphQL queries
- N+1 resolver to optimize queries

## Project Structure

```plaintext
/graphql-server
│
├── schema.js               # GraphQL schema definition
├── resolvers.js            # GraphQL N+1 resolver
├── executableSchema.js     # GraphQL executable schema(schema+implementation) that can be deployed as a server 
├── accessRules.js          # Access control rules
├── authorizationEngine.js  # Middleware for query filtering query based on access control rules
└── server.js               # Main server file
```

## Setup Instructions
 - npm install : to download dependencies
 - npm start : to run server
 - server url : http://localhost:4000/graphql
 - example request :
 ```bash
curl -X POST http://localhost:4000/graphql -H "Authorization: ADMIN" -H "Content-Type: application/json" -d '{"query": "query { getProducts { id name version vendors { id name quantity amount addresses { id name location } } } }"}'
```
