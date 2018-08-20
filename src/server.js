import { ApolloServer } from 'apollo-server-lambda';
import { v1 as neo4j } from 'neo4j-driver';

import schema from './graphql/schema';

export const driver = neo4j.driver(
	process.env.NEO4J_URI,
	neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
);

const server = new ApolloServer({
	schema,
	context: context => ({
		...context,
		driver,
	}),
	tracing: true,
	playground: {
		settings: {
			'editor.cursorShape': 'line',
		},
	},
});

const handler = server.createHandler();

export default handler;
