import { makeExecutableSchema } from 'apollo-server-lambda';
import { augmentSchema } from 'neo4j-graphql-js';

import typeDefs from './type';
import resolvers from './resolver';

export default augmentSchema(
	makeExecutableSchema({
		typeDefs,
		resolvers,
		resolverValidationOptions: {
			requireResolversForResolveType: false,
		},
	}),
);
