const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const axios = require('axios');
const filterQueryBasedOnRole = require('./authorizationEngine');
const executableSchema = require('./executableSchema');

const app = express();

// Route to handle a GraphQL request
app.use('/graphql', express.json(), (req, res) => {
  const query = req.body.query;
  const role = req.headers['authorization'] || 'USER'; // Extract role from Authorization header or use 'USER' by default

  if (!query) {
    return res.status(400).send('Query must be provided in the request body.');
  }

  console.log('Assigned Role :', role);
  console.log('Input GraphQL Query:', query);

  // Filter the query based on the role from the header
  const filteredQuery = filterQueryBasedOnRole(query, role);

  console.log('Filtered GraphQL Query:', filteredQuery);

  // Send the filtered query to the internal GraphQL server
  axios.post('http://localhost:4000/internal-graphql', {
    query: filteredQuery
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => res.json(response.data))
  .catch(error => {
    console.error('Error during request:', error.response ? error.response.data : error.message);
    res.status(500).send(error.toString());
  });
});

// Internal GraphQL server (to handle the filtered queries)
app.use('/internal-graphql', graphqlHTTP({
  schema: executableSchema,
  graphiql: true,
}));

// Start the server
app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000/graphql');
});
