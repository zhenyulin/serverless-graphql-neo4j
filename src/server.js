import { ApolloServer } from 'apollo-server-lambda';

import schema from './graphql/schema';
import neo4jDriver from './lib/neo4j';

const server = new ApolloServer({
	schema,
	context: context => ({
		...context,
		driver: neo4jDriver,
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
