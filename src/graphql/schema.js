import { makeExecutableSchema } from 'apollo-server-lambda';

import typeDefs from './type';
import resolvers from './resolver';

export default makeExecutableSchema({
	typeDefs,
	resolvers,
});
