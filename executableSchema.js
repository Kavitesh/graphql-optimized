const { makeExecutableSchema } = require('graphql-tools');
const typeDefs = require('./schema');
const path = require('path');

const resolverFileIndex = process.argv[2] || ''; 
const resolverPath = resolverFileIndex == 'optimized' ? path.resolve(__dirname, `./optimizedResolvers.js`) 
                                            : path.resolve(__dirname, `./resolvers.js`);
const resolvers = require(resolverPath);

// Create schema with selected resolvers
const executableSchema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = executableSchema;