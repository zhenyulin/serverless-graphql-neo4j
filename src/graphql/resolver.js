import { neo4jgraphql } from 'neo4j-graphql-js';

export default {
	Query: {
		user: async (object, args, context, info) =>
			neo4jgraphql(object, args, context, info, true),
		item: async (object, args, context, info) =>
			neo4jgraphql(object, args, context, info, true),
	},
};
