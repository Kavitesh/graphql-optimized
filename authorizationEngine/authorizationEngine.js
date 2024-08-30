const filterQueryBasedOnRole = require('./accessRulesValidator');
const axios = require('axios');
const path = require('path');

const authorizationEngine = (req, res) => {
    const query = req.body.query;
    const role = req.headers['authorization'] || 'USER'; // Extract role from Authorization header or use 'USER' by default
  
    if (!query) {
      return res.status(400).send('Query must be provided in the request body.');
    }
  
    console.log('Assigned Role :', role);
    console.log('Input GraphQL Query:', query);
  
    // Filter the query based on the role from the header
    const filteredQuery = process.argv[2] == 'normal' ? query : filterQueryBasedOnRole(query, role);
  
    console.log('Final GraphQL Query:', filteredQuery);
  
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
  };

module.exports = authorizationEngine;