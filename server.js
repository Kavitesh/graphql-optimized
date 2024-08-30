const express = require('express');
const executableSchema = require('./executableSchema');
const { graphqlHTTP } = require('express-graphql');

const app = express();

// To handle a GraphQL request
app.use('/graphql', graphqlHTTP({
  schema: executableSchema,
  graphiql: true,
}));

// Start the server
app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000/graphql');
});
