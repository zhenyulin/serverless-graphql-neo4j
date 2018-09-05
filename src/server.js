import { ApolloServer } from 'apollo-server-lambda';

import schema from './graphql/schema';
import createConstraint from './lib/create-constraint';

const server = new ApolloServer({
	schema,
	tracing: true,
	playground: {
		settings: {
			'editor.cursorShape': 'line',
		},
	},
});

const setupHandler = async () => {
	await createConstraint();
	return server.createHandler();
};

export default setupHandler();
