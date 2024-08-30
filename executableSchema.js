const { makeExecutableSchema } = require('graphql-tools');
const typeDefs = require('./schema');
const path = require('path');

const resolverFileIndex = process.argv[2] || ''; 
const resolverPath = resolverFileIndex == 'normal' ? path.resolve(__dirname, `./resolvers/normalResolvers.js`) 
                                            : path.resolve(__dirname, `./resolvers/optimizedResolvers`);
const resolvers = require(resolverPath);

// Create schema with selected resolvers
const executableSchema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = executableSchema;