import { neo4jgraphql } from 'neo4j-graphql-js';

export default {
	Query: {
		Users: (...args) => neo4jgraphql(...args),
		User: (...args) => neo4jgraphql(...args),
		UserByLikedItem: (...args) => neo4jgraphql(...args),
		Items: (...args) => neo4jgraphql(...args),
		Item: (...args) => neo4jgraphql(...args),
	},
};
