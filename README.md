# GraphQL Server

## Project Structure

```plaintext
/graphql-optimized
├── /db                        # Database-related files
│   ├── populateDb.js             # Helper code to generate dummy db
│   └── products.db               # Dummy database, auto generate by command 'npm run populateDb'
├── executableSchema.js        # GraphQL executable schema (schema + resolvers) for deployment
├── optimizeResolvers.js       # Performance optimized resolver
├── package.json               # Project package file
├── resolvers.js         # GraphQL resolver
├── schema.js                  # GraphQL schema definition
└── server.js                  # Main server entry point
```

## Setup Instructions
 - npm install : to download dependencies
 - npm start optimized : to run server with our optimized resolver
 - npm start : to run server with normal graphql
 - server url : http://localhost:4000/graphql
 ```bash
 npm install
 npm start # or use 'npm start optimized' for improved performance
 curl -X POST http://localhost:4000/graphql -H "Authorization: USER" -H "Content-Type: application/json" -d '{"query": "query { getProducts { id name version vendors { id name quantity amount addresses { id name location } } } }"}'
```
