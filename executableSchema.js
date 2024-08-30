const resolvers = require('./resolvers');
const { makeExecutableSchema } = require('graphql-tools');
const typeDefs = require('./schema');

// Create schema with resolvers
const executableSchema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = executableSchema;