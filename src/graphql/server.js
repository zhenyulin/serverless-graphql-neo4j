import express from 'express';
import serverless from 'serverless-http';
import expressGraphql from 'express-graphql';
import { makeExecutableSchema } from 'graphql-tools';

import typeDefs from './type';
import resolvers from './resolver';

const schema = makeExecutableSchema({ typeDefs, resolvers });
const handler = expressGraphql({
	schema,
	graphiql: true,
});
const app = express().use(handler);

export default serverless(app);
