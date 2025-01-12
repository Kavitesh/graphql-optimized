const express = require('express');
const internalGraphqlEngine = require('./internalGraphqlEngine');
const authorizationEngine = require('./authorizationEngine/authorizationEngine')

const app = express();

// To handle a GraphQL request through authorization engine then pass to internal graphql server
app.use('/graphql', express.json(), authorizationEngine);

// Internal GraphQL server (to handle the filtered queries)
app.use('/internal-graphql', internalGraphqlEngine);

// Start the server
app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000/graphql');
});
