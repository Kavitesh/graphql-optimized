const executableSchema = require('./executableSchema');
const { graphqlHTTP } = require('express-graphql');

const internalGraphqlEngine = graphqlHTTP({
    schema: executableSchema,
    graphiql: true,
});

module.exports = internalGraphqlEngine;