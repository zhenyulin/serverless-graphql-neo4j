import { ApolloServer } from 'apollo-server-lambda';

import schema from './graphql/schema';

const server = new ApolloServer({
	schema,
	tracing: true,
	playground: {
		settings: {
			'editor.cursorShape': 'line',
		},
	},
});

const handler = server.createHandler();

export default handler;
